export function toRadians(angle: number) {
    return angle * (Math.PI / 180);
}

export function toDegrees(angle: number) {
    return angle * (180 / Math.PI);
}

export class Theta {
    degrees!: number;
    radians!: number;

    constructor(value: { degrees?: number; radians?: number }) {
        const { degrees, radians } = value;
        if (degrees === undefined && radians === undefined)
            throw new Error("degrees or radians must be provided");
        if (degrees !== undefined) {
            this.degrees = degrees;
            this.radians = toRadians(degrees);
        }
        if (radians !== undefined) {
            this.radians = radians;
            this.degrees = toDegrees(radians);
        }
    }

    add(deg: number) {
        return new Theta({ degrees: this.degrees + deg });
    }

    sub(deg: number) {
        return new Theta({ degrees: this.degrees - deg });
    }

    static Degrees(deg: number) {
        return new Theta({ degrees: deg });
    }

    static Radians(rad: number) {
        return new Theta({ radians: rad });
    }
}
/**
 三角函数
 @link https://zh.wikipedia.org/wiki/%E4%B8%89%E8%A7%92%E5%87%BD%E6%95%B0#%E4%BB%A5%E7%9B%B4%E8%A7%92%E5%9D%90%E6%A0%87%E7%B3%BB%E4%BE%86%E5%AE%9A%E4%B9%89
 *
 * */
// 根据角度与 X，计算斜边
function getRX(theta: Theta, x: number) {
    return Math.abs(x / Math.cos(theta.radians));
}
// 根据角度与 Y，计算斜边
function getRY(theta: Theta, y: number) {
    return Math.abs(y / Math.sin(theta.radians));
}

/**
 * @description 笛卡尔坐标系转极坐标系
 * 接受一个坐标，返回其距原点的距离r和角度theta
 * */
export function cartesian2Polar(x: number, y: number) {
    const r = Math.sqrt(x * x + y * y);
    const theta = Theta.Radians(Math.atan(y / x));
    return { r, theta };
}

/**
 * @desccription 极坐标系转笛卡尔坐标系
 * 接受一个距原点的距离r和一个角度theta
 * */
export function polar2Cartesian(r: number, theta: Theta) {
    const radians = theta.radians;
    const x = r * Math.cos(radians);
    const y = r * Math.sin(radians);
    return { x, y };
}

type Rect = { x: number; y: number; width: number; height: number };
/**
 * @description 计算一个矩形与其中心射线的交点（坐标在矩形中心）
 * 接受矩形坐标尺寸信息与射线角度
 * */
export function getCrossPoint(rect: Rect, theta: Theta) {
    const x = rect.width / 2;
    const y = rect.height / 2;

    // 延长矩形四边，会形成一个井字行，射线从中心出发，必然会与与两条线相交。
    // 分别计算这两个交点距离中心的距离，取最小值
    const r1 = getRX(theta, x);
    const r2 = getRY(theta, y);
    const r = Math.min(r1, r2);
    const point = polar2Cartesian(r, theta);

    // point.x += rect.width / 2 + rect.x;
    // point.y += rect.height / 2 + rect.y;

    // 得到交点与中心距离后，相当于具有了一个极坐标，再转换为笛卡尔坐标
    return {
        point,
        radius: r,
    };
}

export function getCross(rect: Rect, theta: Theta) {
    const head = getCrossPoint(rect, theta).point; // 射线正前方的交点
    const tail = getCrossPoint(rect, Theta.Degrees(theta.degrees + 180)).point; // 射线背后的交点

    return {
        head,
        tail,
    };
}

export function getMidpoint(x1: number, y1: number, x2: number, y2: number): { x: number, y: number } {
    const midpointX = (x1 + x2) / 2;
    const midpointY = (y1 + y2) / 2;
    return { x: midpointX, y: midpointY };
}

type Point = { x: number, y: number };
/**
 * @description 获取两点中垂线上某一点，offset为偏移量，正负表示上下
 * */
export function getBisectionPoint(a: Point, b: Point, offset: number) {
    const mid = getMidpoint(a.x, a.y, b.x, b.y);
    const angle =  Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    const offsetPoint = polar2Cartesian(offset, Theta.Degrees(-90 + angle));

    return {
        x: mid.x + offsetPoint.x,
        y: mid.y + offsetPoint.y,
    }
}
