import { Point2d } from '../types/Point2d';
import { Point3d } from '../types/Point3d';

export function point3dToString (point: Point3d): string {
    return `${point.x} ${point.y} ${point.z}`;
}

export function addPoint3ds (point: Point3d, offset: Point3d): Point3d {
    return {
        x: point.x + offset.x,
        y: point.y + offset.y,
        z: point.z + offset.z
    };
}

export function calculateDistance (point1: Point2d, point2: Point2d): number | null {
    if (!point1.x || !point1.y || !point2.x || !point2.y) {
        return null;
    }

    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}