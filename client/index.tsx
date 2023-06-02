import * as ReactDOM from "react-dom"
import * as React from 'react'

import './css/style.css'
import App from './app'

const mountNode = document.getElementById("app")

ReactDOM.render(<App/>, mountNode)