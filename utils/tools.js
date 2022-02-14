
const lerp = (t, p1, p2) => (1 - t) * p1 + t * p2;

const reduce = (t, p1, p2, ...ps) =>
  ps.length > 0
    ? [lerp(t, p1, p2), ...reduce(t, p2, ...ps)]
    : [lerp(t, p1, p2)];

const deCasteljau = (t, ps) =>
  ps.length > 1 ? deCasteljau(t, reduce(t, ...ps)) : ps[0];