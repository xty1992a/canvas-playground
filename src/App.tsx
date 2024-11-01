import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Instrument from "./components/instrument.tsx";

const data = [
    {label: '金灵根', value: 0.32},
    // {label: '木灵根', value: 0.24},
    // {label: '水灵根', value: 0.56},
    {label: '火灵根', value: 0.78},
    {label: '土灵根', value: 0.98},
]

function App() {

    return (
        <div className="app">
            <Instrument items={data}/>
        </div>
    )
}

export default App
