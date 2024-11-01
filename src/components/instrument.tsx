import React, {FC, useCallback, useEffect} from 'react'
import {chunk} from 'lodash-es'
import * as utils from './utils.ts'


interface Item {
    value: number
    label: string
}

interface Props {
    items: Item[]
    size?: number
    padding?: number
}

interface Point {
    x: number
    y: number
}

const Instrument: FC<Props> = (props) => {
    const {size = 1000, padding = 100, items} = props;
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const draw = useCallback(() => {

        //# region setup and define

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas) return
        if (!ctx) return

        canvas.width = size;
        canvas.height = size;
        canvas.style.cssText = `width: ${size / 2}px; height: ${size / 2}px;`


        const gap = ((size - padding * 2) / 5) / 2
        const steps = [...Array(5)].fill(0).map((n, i) => (i + 1) * gap)
        const maxlength = Math.max(...steps)
        const origin = {x: size / 2, y: size / 2}

        console.log(items)
        //# endregion

        //# region draw rills

        ctx.strokeStyle = 'rgba(224,141,141,0.56)'

        ctx.save()

        ctx.translate(size / 2, size / 2);

        steps.forEach((step, i) => {
            ctx.beginPath()
            // console.log(`绘制第${i}个圆， 半径为${step / 2}`)
            // ctx.fillStyle = '#333'
            // ctx.font = '40px serif'
            // ctx.fillText(`${i}`, step / 2 - 10, 0)
            ctx.arc(0, 0, step, 0, Math.PI * 2)
            ctx.stroke()
            ctx.closePath()
        })

        ctx.restore()
        //# endregion

        //# region draw items
        items.forEach((item, i) => {
            const startLength = steps[0]
            const endLength = steps[steps.length - 1]
            const start = utils.polar2Cartesian(startLength, utils.Theta.Degrees(360 / items.length * i))
            const end = utils.polar2Cartesian(endLength, utils.Theta.Degrees(360 / items.length * i))

            ctx.beginPath()
            ctx.moveTo(start.x + origin.x, start.y + origin.y)
            ctx.lineTo(end.x + origin.x, end.y + origin.y)
            ctx.stroke()
            ctx.closePath()
            ctx.font = '30px serif'

            const end0 = utils.polar2Cartesian(endLength + 50, utils.Theta.Degrees(360 / items.length * i))

            ctx.save()
            ctx.translate(end0.x + origin.x, end0.y + origin.y)
            ctx.rotate(utils.Theta.Degrees(360 / items.length * i + 90).radians)
            ctx.textAlign = 'center'
            ctx.fillText(`${item.label}`, 0, 0)

            ctx.restore()

        })

        const arr = items.map((n, i) => {
            const length = n.value * maxlength
            const degree = utils.Theta.Degrees(360 / items.length * i)
            const point = utils.polar2Cartesian(length, degree)
            return {
                point: {
                    x: point.x + origin.x,
                    y: point.y + origin.y
                },
                value: n.value,
                label: n.label,
                length
            }
        })

        ctx.strokeStyle = 'rgba(193,40,40,1)'
        ctx.lineWidth = 4
        ctx.save()
        ctx.beginPath()


        arr.forEach((item, index) => {
            const next = index === arr.length - 1 ? arr[0] : arr[index + 1]

            const a = item.point
            const b = next.point

            ctx.moveTo(a.x, a.y)
            const point = utils.getBisectionPoint(a, b, 100)
            // const mid = utils.getMidpoint(a.x, a.y, b.x, b.y) // 中点
            // ctx.fillRect(mid.x - 5, mid.y - 5, 10, 10)
            ctx.bezierCurveTo(a.x, a.y, point.x, point.y, b.x, b.y)
        })

        ctx.stroke()
        ctx.closePath()
        ctx.restore()


        //# endregion


    }, [size, padding, items])

    useEffect(draw, [draw]);


    return <canvas className="instrument" ref={canvasRef}/>
}

export default Instrument
