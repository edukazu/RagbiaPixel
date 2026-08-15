(() => {
  'use strict';

  // M001.7A — Manual Override da Perseguição.
  // Hierarquia oficial deste gate:
  //   Dash > movimento manual > perseguição automática.
  //
  // A perseguição continua sendo linha direta até o attackRange e NÃO possui
  // pathfinding/desvio inteligente. O jogador pode assumir o movimento manual
  // a qualquer momento enquanto mantém Engage; ao soltar o input, o chase
  // reassume automaticamente caso continue necessário.
  const PROFILES = Object.freeze({
    warrior: Object.freeze({ id: 'warrior', speed: 300, stopInside: 8 }),
    archer: Object.freeze({ id: 'archer', speed: 300, stopInside: 8 })
  });

  const MANUAL_THRESHOLD = 0.12;

  function profileFor(classId) {
    return PROFILES[classId] || PROFILES.warrior;
  }

  function plan(target, playerX, playerY, classId, attackRange) {
    const profile = profileFor(classId);
    if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.y) || !Number.isFinite(attackRange)) {
      return { active: false, dirX: 0, dirY: 0, distance: Infinity, maxTravel: 0, speed: profile.speed, desiredDistance: attackRange };
    }
    const dx = target.x - playerX;
    const dy = target.y - playerY;
    const distance = Math.hypot(dx, dy);
    if (distance <= attackRange || distance < 0.001) {
      return { active: false, dirX: 0, dirY: 0, distance, maxTravel: 0, speed: profile.speed, desiredDistance: attackRange };
    }
    const desiredDistance = Math.max(0, attackRange - profile.stopInside);
    const maxTravel = Math.max(0, distance - desiredDistance);
    return {
      active: maxTravel > 0,
      dirX: dx / distance,
      dirY: dy / distance,
      distance,
      maxTravel,
      speed: profile.speed,
      desiredDistance
    };
  }

  function deltaForPlan(pursuitPlan, dt) {
    if (!pursuitPlan || !pursuitPlan.active || dt <= 0) return { dx: 0, dy: 0, travel: 0 };
    const travel = Math.min(pursuitPlan.maxTravel, pursuitPlan.speed * dt);
    return {
      dx: pursuitPlan.dirX * travel,
      dy: pursuitPlan.dirY * travel,
      travel
    };
  }

  function manualIntent(x, y, threshold = MANUAL_THRESHOLD) {
    const length = Math.hypot(x, y);
    return { active: length > threshold, length };
  }

  // Resolve somente a prioridade entre movimento manual e chase.
  // O Dash é resolvido no game loop acima desta função e, portanto, continua
  // sendo a prioridade máxima do sistema.
  function resolveMovement(pursuitPlan, manualX, manualY, normalSpeed, dt) {
    const intent = manualIntent(manualX, manualY);
    if (intent.active) {
      let x = manualX;
      let y = manualY;
      if (intent.length > 1) {
        x /= intent.length;
        y /= intent.length;
      }
      return {
        mode: 'manual',
        manualOverride: !!(pursuitPlan && pursuitPlan.active),
        dx: x * normalSpeed * dt,
        dy: y * normalSpeed * dt,
        visualX: x,
        visualY: y
      };
    }

    if (pursuitPlan && pursuitPlan.active) {
      const chase = deltaForPlan(pursuitPlan, dt);
      return {
        mode: 'chase',
        manualOverride: false,
        dx: chase.dx,
        dy: chase.dy,
        visualX: pursuitPlan.dirX,
        visualY: pursuitPlan.dirY
      };
    }

    return {
      mode: 'idle',
      manualOverride: false,
      dx: 0,
      dy: 0,
      visualX: 0,
      visualY: 0
    };
  }

  function selfTest() {
    const errors = [];
    const far = plan({ x: 300, y: 0 }, 0, 0, 'warrior', 130);
    if (!far.active) errors.push('alvo fora do attackRange deve ativar perseguição');
    if (Math.abs(far.dirX - 1) > 1e-6 || Math.abs(far.dirY) > 1e-6) errors.push('direção deve apontar ao alvo');
    if (Math.abs(far.desiredDistance - 122) > 1e-6) errors.push('guerreiro deve usar margem interna de 8 px');
    const d = deltaForPlan(far, 0.05);
    if (Math.abs(d.travel - 15) > 1e-6) errors.push('velocidade de perseguição deve ser 300 px/s');
    const near = plan({ x: 120, y: 0 }, 0, 0, 'warrior', 130);
    if (near.active) errors.push('alvo dentro do attackRange não deve ativar perseguição');
    const archer = plan({ x: 600, y: 0 }, 0, 0, 'archer', 520);
    if (!archer.active || Math.abs(archer.desiredDistance - 512) > 1e-6) errors.push('arqueiro deve parar ligeiramente dentro do attackRange');
    const clamp = deltaForPlan(plan({ x: 131, y: 0 }, 0, 0, 'warrior', 130), 0.05);
    if (clamp.travel > 9.001) errors.push('passo final não pode ultrapassar a distância planejada');

    // M001.7A: movimento manual sempre vence o chase.
    const manual = resolveMovement(far, 0, 1, 300, 0.05);
    if (manual.mode !== 'manual' || !manual.manualOverride) errors.push('input manual deve sobrescrever chase ativo');
    if (Math.abs(manual.dx) > 1e-6 || Math.abs(manual.dy - 15) > 1e-6) errors.push('override manual deve respeitar direção/speed normais');

    // Sem input manual, o mesmo plano deve reassumir automaticamente.
    const resumed = resolveMovement(far, 0, 0, 300, 0.05);
    if (resumed.mode !== 'chase' || resumed.manualOverride) errors.push('chase deve reassumir quando input manual cessa');
    if (Math.abs(resumed.dx - 15) > 1e-6 || Math.abs(resumed.dy) > 1e-6) errors.push('chase retomado deve continuar apontando ao alvo');

    // Dentro do range não existe chase; input manual ainda move normalmente.
    const manualInRange = resolveMovement(near, -1, 0, 300, 0.05);
    if (manualInRange.mode !== 'manual' || manualInRange.manualOverride) errors.push('movimento manual dentro do attackRange não deve ser marcado como override de chase');

    // Ruído abaixo do threshold não pode cancelar o chase.
    const tiny = resolveMovement(far, 0.05, 0.04, 300, 0.05);
    if (tiny.mode !== 'chase') errors.push('ruído de input abaixo do threshold não deve cancelar chase');

    return { ok: errors.length === 0, errors };
  }

  window.RagbiaPursuitV0 = {
    PROFILES,
    MANUAL_THRESHOLD,
    profileFor,
    plan,
    deltaForPlan,
    manualIntent,
    resolveMovement,
    selfTest
  };
})();
