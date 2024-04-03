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