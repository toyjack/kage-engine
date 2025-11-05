/**
 * KAGE Engine - Kanji Automatic Generation Engine
 * ESM Module Entry Point
 */

// Export core classes
export { Kage } from './kage.js';
export { Buhin } from './buhin.js';
export { Polygon } from './polygon.js';
export { Polygons } from './polygons.js';

// Export geometry utilities
export {
  point,
  getCrossPoint,
  isCross,
  isCrossBox,
  isCrossBoxWithOthers,
  isCrossWithOthers
} from './2d.js';

// Export curve utilities
export {
  divide_curve,
  calculateBezier,
  find_offcurve,
  get_candidate
} from './curve.js';

// Export drawing functions (for advanced usage)
export {
  cdDrawCurveU,
  cdDrawBezier,
  cdDrawCurve,
  cdDrawLine
} from './kagecd.js';

export {
  dfTransform,
  dfDrawFont
} from './kagedf.js';

// Default export for convenience
import { Kage } from './kage.js';
import { Polygons } from './polygons.js';
export default { Kage, Polygons };
