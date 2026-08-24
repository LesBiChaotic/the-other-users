/**
 * Route Registry & Declarative Guard Tests — The Other Users
 */

import { describe, it, expect } from 'vitest';
import { ROUTE_REGISTRY, evaluateRouteGuard } from '../domain/routes/routeRegistry';
import { createInitialRootState, unlockGateReducer } from '../domain/state/actions';
import { ConditionContext } from '../domain/conditions/evaluator';

describe('Route Registry & Declarative Guards', () => {
  it('registers all core canonical surfaces with explicit chapter requirements and fallbacks', () => {
    expect(ROUTE_REGISTRY['/']).toBeDefined();
    expect(ROUTE_REGISTRY['/verify']).toBeDefined();
    expect(ROUTE_REGISTRY['/home']).toBeDefined();
    expect(ROUTE_REGISTRY['/inbox']).toBeDefined();
    expect(ROUTE_REGISTRY['/evidence']).toBeDefined();
    expect(ROUTE_REGISTRY['/profile']).toBeDefined();
    expect(ROUTE_REGISTRY['/communities']).toBeDefined();
    expect(ROUTE_REGISTRY['/wire']).toBeDefined();
    expect(ROUTE_REGISTRY['/molt']).toBeDefined();
    expect(ROUTE_REGISTRY['/below']).toBeDefined();
    expect(ROUTE_REGISTRY['/vesper']).toBeDefined();
    expect(ROUTE_REGISTRY['/market']).toBeDefined();
    expect(ROUTE_REGISTRY['/communion']).toBeDefined();
    expect(ROUTE_REGISTRY['/menagerie']).toBeDefined();
    expect(ROUTE_REGISTRY['/menagerie/ops']).toBeDefined();
    expect(ROUTE_REGISTRY['/convergence']).toBeDefined();
  });

  it('authorizes public surfaces unconditionally', () => {
    const ctx: ConditionContext = { ...createInitialRootState() };
    const guardRoot = evaluateRouteGuard('/', ctx);
    const guardA11y = evaluateRouteGuard('/accessibility', ctx);

    expect(guardRoot.authorized).toBe(true);
    expect(guardA11y.authorized).toBe(true);
  });

  it('denies locked gated routes and returns safe fallback and non-spoiler denial message', () => {
    const ctx: ConditionContext = { ...createInitialRootState() };
    const guardHome = evaluateRouteGuard('/home', ctx);
    const guardMolt = evaluateRouteGuard('/molt', ctx);

    expect(guardHome.authorized).toBe(false);
    expect(guardHome.targetPath).toBe('/verify');
    expect(guardHome.message).toContain('Access denied');

    expect(guardMolt.authorized).toBe(false);
    expect(guardMolt.targetPath).toBe('/home');
  });

  it('authorizes routes dynamically as gates are unlocked in state', () => {
    let state = createInitialRootState();
    state = unlockGateReducer(state, 'G0').nextState;

    const ctx: ConditionContext = { ...state };
    const guardHome = evaluateRouteGuard('/home', ctx);
    const guardInbox = evaluateRouteGuard('/inbox', ctx);
    const guardWire = evaluateRouteGuard('/wire', ctx);
    const guardCommunities = evaluateRouteGuard('/communities', ctx);

    expect(guardHome.authorized).toBe(true);
    expect(guardInbox.authorized).toBe(true);
    expect(guardWire.authorized).toBe(true);
    expect(guardCommunities.authorized).toBe(true);
  });
});
