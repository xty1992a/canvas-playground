import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Instrument from "./components/instrument.tsx";


function App() {

    const [items, setItems] = useState([
        {label: '金灵根', value: 0.32},
        {label: '木灵根', value: 0},
        {label: '水灵根', value: 0},
        {label: '火灵根', value: 0.78},
        {label: '土灵根', value: 0.98},
    ])

    const [offset, setOffset] = useState(80)
    const [rotate, setRotate] = useState(-90)

    const update = (type: string, value: number) => {
        setItems(items.map(n => n.label === type ? {...n, value} : n))
    }

    return (
        <div className="app">

            <div>
                <div className="form">
                    {
                        items.map(item => <div>
                            <label>{item.label}</label>
                            <input type="range" min="0" max="1" step="0.01" value={item.value}
                                   onChange={e => update(item.label, parseFloat(e.target.value))}/>
                        </div>)
                    }

                    <div>
                        <label>弧线偏移量</label>
                        <input type="range" min="-300" max="300" step="1" value={offset}
                               onChange={e => setOffset(parseFloat(e.target.value))}/>
                    </div>
                    <div>
                        <label>画布旋转角度</label>
                        <input type="range" min="0" max="360" step="10" value={rotate}
                               onChange={e => setRotate(parseFloat(e.target.value))}/>
                    </div>

                </div>
                <Instrument items={items.filter(n => n.value !== 0)} offset={offset} rotate={rotate}/>
            </div>

        </div>
    )
}

export default App
