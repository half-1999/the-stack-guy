import { useState, useEffect, useRef } from 'react';
import {
  Code, Eye, Copy, Check,
  Monitor, Smartphone, Tablet, Lightbulb,
  FileCode, FileJson, FileText, Sparkles
} from 'lucide-react';

const PROJECT_IDEAS = [
  { id: 1, name: 'Calculator', html: `<div class="calculator">\n  <div class="display">0</div>\n  <div class="buttons">\n    <button class="operator" data-value="C">C</button>\n    <button class="operator" data-value="/">÷</button>\n    <button class="operator" data-value="*">×</button>\n    <button class="operator" data-value="DEL">⌫</button>\n    <button data-value="7">7</button>\n    <button data-value="8">8</button>\n    <button data-value="9">9</button>\n    <button class="operator" data-value="-">−</button>\n    <button data-value="4">4</button>\n    <button data-value="5">5</button>\n    <button data-value="6">6</button>\n    <button class="operator" data-value="+">+</button>\n    <button data-value="1">1</button>\n    <button data-value="2">2</button>\n    <button data-value="3">3</button>\n    <button class="equal" data-value="=">=</button>\n    <button class="zero" data-value="0">0</button>\n    <button data-value=".">.</button>\n  </div>\n</div>`, css: `.calculator {\n  background: linear-gradient(145deg, #1a1a2e, #16213e);\n  border-radius: 24px;\n  padding: 24px;\n  width: 320px;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.5);\n}\n\n.display {\n  background: #0f0f23;\n  border-radius: 16px;\n  padding: 20px;\n  text-align: right;\n  font-size: 2.5rem;\n  font-weight: bold;\n  color: #fff;\n  margin-bottom: 20px;\n  font-family: 'Courier New', monospace;\n  overflow: hidden;\n}\n\n.buttons {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 12px;\n}\n\nbutton {\n  background: #252542;\n  border: none;\n  border-radius: 12px;\n  padding: 20px;\n  font-size: 1.5rem;\n  color: #fff;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\nbutton:hover {\n  background: #303050;\n  transform: scale(1.05);\n}\n\nbutton:active {\n  transform: scale(0.95);\n}\n\n.operator {\n  background: #ff6b35;\n}\n\n.operator:hover {\n  background: #ff8555;\n}\n\n.equal {\n  background: #00d9ff;\n  grid-row: span 2;\n}\n\n.equal:hover {\n  background: #33e1ff;\n}\n\n.zero {\n  grid-column: span 2;\n}`, js: `let display = document.querySelector('.display');\nlet current = '0';\nlet operator = null;\nlet previous = null;\ndocument.querySelectorAll('button').forEach(btn => {\n  btn.addEventListener('click', () => {\n    const val = btn.dataset.value;\n    if (val === 'C') {\n      current = '0';\n      operator = null;\n      previous = null;\n    } else if (val === 'DEL') {\n      current = current.length > 1 ? current.slice(0, -1) : '0';\n    } else if (val === '=') {\n      if (operator && previous !== null) {\n        current = eval(previous + operator + current).toString();\n        operator = null;\n        previous = null;\n      }\n    } else if (['+', '-', '*', '/'].includes(val)) {\n      operator = val;\n      previous = current;\n      current = '0';\n    } else if (val === '.') {\n      if (!current.includes('.')) current += '.';\n    } else {\n      current = current === '0' ? val : current + val;\n    }\n    display.textContent = current.length > 10 ? current.slice(0, 10) : current;\n  });\n});`, category: 'Utility', difficulty: 'Beginner' },
  { id: 2, name: 'Weather App', html: `<div class="weather-app">\n  <div class="search-box">\n    <input type="text" placeholder="Search city...">\n    <button>Search</button>\n  </div>\n  <div class="weather-info">\n    <div class="city">New York</div>\n    <div class="temp">72°F</div>\n    <div class="condition">Partly Cloudy</div>\n    <div class="details">\n      <div class="detail">💧 65%</div>\n      <div class="detail">💨 12 mph</div>\n      <div class="detail">☀️ 45%</div>\n    </div>\n  </div>\n</div>`, css: `.weather-app {\n  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);\n  border-radius: 24px;\n  padding: 40px;\n  width: 340px;\n  color: white;\n  text-align: center;\n}\n\n.search-box {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 30px;\n}\n\n.search-box input {\n  flex: 1;\n  padding: 12px 16px;\n  border: none;\n  border-radius: 12px;\n  background: rgba(255,255,255,0.2);\n  color: white;\n  font-size: 14px;\n}\n\n.search-box input::placeholder {\n  color: rgba(255,255,255,0.7);\n}\n\n.search-box button {\n  padding: 12px 20px;\n  border: none;\n  border-radius: 12px;\n  background: white;\n  color: #667eea;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n.city {\n  font-size: 1.8rem;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n\n.temp {\n  font-size: 4rem;\n  font-weight: bold;\n}\n\n.condition {\n  font-size: 1.2rem;\n  margin-bottom: 20px;\n  opacity: 0.9;\n}\n\n.details {\n  display: flex;\n  justify-content: space-around;\n  background: rgba(255,255,255,0.15);\n  border-radius: 16px;\n  padding: 16px;\n}\n\n.detail {\n  font-size: 0.9rem;\n}`, js: `const input = document.querySelector('.search-box input');\nconst button = document.querySelector('.search-box button');\nconst cityEl = document.querySelector('.city');\nconst tempEl = document.querySelector('.temp');\nconst conditionEl = document.querySelector('.condition');\n\nconst updateWeather = () => {\n  const city = input.value || 'New York';\n  cityEl.textContent = city;\n  const temps = [65, 72, 78, 55, 82];\n  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Clear'];\n  tempEl.textContent = temps[Math.floor(Math.random() * temps.length)] + '°F';\n  conditionEl.textContent = conditions[Math.floor(Math.random() * conditions.length)];\n};\n\nbutton.addEventListener('click', updateWeather);\ninput.addEventListener('keypress', (e) => {\n  if (e.key === 'Enter') updateWeather();\n});`, category: 'API', difficulty: 'Beginner' },
  { id: 3, name: 'Digital Clock', html: `<div class="clock-container">\n  <div class="clock">\n    <div class="time">12:00:00</div>\n    <div class="date">Monday, Jan 1</div>\n  </div>\n  <div class="greeting">Good Morning!</div>\n</div>`, css: `.clock-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  background: #0a0a0f;\n  font-family: 'Courier New', monospace;\n}\n\n.clock {\n  background: linear-gradient(145deg, #1a1a2e, #0f0f1a);\n  border: 2px solid #333;\n  border-radius: 24px;\n  padding: 40px 60px;\n  text-align: center;\n  box-shadow: 0 0 60px rgba(0, 217, 255, 0.1);\n}\n\n.time {\n  font-size: 4rem;\n  font-weight: bold;\n  color: #00d9ff;\n  text-shadow: 0 0 30px rgba(0, 217, 255, 0.5);\n  letter-spacing: 4px;\n}\n\n.date {\n  font-size: 1.2rem;\n  color: #888;\n  margin-top: 10px;\n  letter-spacing: 2px;\n}\n\n.greeting {\n  font-size: 1.5rem;\n  color: #ff6b35;\n  margin-top: 30px;\n  letter-spacing: 3px;\n}`, js: `const timeEl = document.querySelector('.time');\nconst dateEl = document.querySelector('.date');\nconst greetingEl = document.querySelector('.greeting');\n\nconst updateClock = () => {\n  const now = new Date();\n  const hours = now.getHours().toString().padStart(2, '0');\n  const mins = now.getMinutes().toString().padStart(2, '0');\n  const secs = now.getSeconds().toString().padStart(2, '0');\n  timeEl.textContent = hours + ':' + mins + ':' + secs;\n  \n  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];\n  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];\n  dateEl.textContent = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();\n  \n  const hour = now.getHours();\n  if (hour < 12) greetingEl.textContent = 'Good Morning!';\n  else if (hour < 18) greetingEl.textContent = 'Good Afternoon!';\n  else greetingEl.textContent = 'Good Evening!';\n};\n\nsetInterval(updateClock, 1000);\nupdateClock();`, category: 'Utility', difficulty: 'Beginner' },
  { id: 4, name: 'Todo List', html: `<div class="todo-app">\n  <h2>My Tasks</h2>\n  <div class="input-group">\n    <input type="text" placeholder="Add new task...">\n    <button>Add</button>\n  </div>\n  <ul class="tasks">\n    <li class="completed">✓ Learn HTML</li>\n    <li>✎ Practice CSS</li>\n    <li>✎ Build Projects</li>\n    <li>✎ Master JavaScript</li>\n  </ul>\n</div>`, css: `.todo-app {\n  background: #1a1a2e;\n  border-radius: 20px;\n  padding: 30px;\n  width: 360px;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.4);\n}\n\nh2 {\n  color: #fff;\n  margin-bottom: 20px;\n  font-size: 1.5rem;\n}\n\n.input-group {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n}\n\n.input-group input {\n  flex: 1;\n  padding: 14px 18px;\n  border: 2px solid #333;\n  border-radius: 12px;\n  background: #0f0f1a;\n  color: #fff;\n  font-size: 14px;\n}\n\n.input-group input:focus {\n  outline: none;\n  border-color: #00d9ff;\n}\n\n.input-group button {\n  padding: 14px 24px;\n  background: #00d9ff;\n  border: none;\n  border-radius: 12px;\n  color: #000;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n.tasks {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\n.tasks li {\n  padding: 14px 18px;\n  background: #252542;\n  border-radius: 12px;\n  margin-bottom: 10px;\n  color: #ddd;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.tasks li:hover {\n  background: #303050;\n  transform: translateX(5px);\n}\n\n.tasks li.completed {\n  text-decoration: line-through;\n  opacity: 0.5;\n}`, js: `const input = document.querySelector('.input-group input');\nconst button = document.querySelector('.input-group button');\nconst tasks = document.querySelector('.tasks');\n\nconst addTask = () => {\n  const text = input.value.trim();\n  if (!text) return;\n  const li = document.createElement('li');\n  li.textContent = '✎ ' + text;\n  li.addEventListener('click', () => {\n    li.classList.toggle('completed');\n    li.innerHTML = li.classList.contains('completed') ? '✓ ' + text : '✎ ' + text;\n  });\n  tasks.appendChild(li);\n  input.value = '';\n};\n\nbutton.addEventListener('click', addTask);\ninput.addEventListener('keypress', (e) => {\n  if (e.key === 'Enter') addTask();\n});`, category: 'Utility', difficulty: 'Beginner' },
  { id: 5, name: 'Quiz Game', html: `<div class="quiz-app">\n  <div class="question">\n    <span class="q-num">Q1</span>\n    <p>What does HTML stand for?</p>\n  </div>\n  <div class="options">\n    <button>Hyper Text Markup Language</button>\n    <button>Home Tool Markup Language</button>\n    <button>Hyperlinks and Text Markup</button>\n    <button>None of above</button>\n  </div>\n  <div class="score">Score: 0</div>\n</div>`, css: `.quiz-app {\n  background: linear-gradient(135deg, #1e1745 0%, #0d0d1a 100%);\n  border-radius: 24px;\n  padding: 40px;\n  width: 380px;\n  color: white;\n}\n\n.question {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 25px;\n}\n\n.q-num {\n  background: #ff6b35;\n  padding: 10px 15px;\n  border-radius: 10px;\n  font-weight: bold;\n}\n\n.question p {\n  font-size: 1.1rem;\n  font-weight: 500;\n}\n\n.options {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.options button {\n  padding: 16px 20px;\n  background: #252542;\n  border: 2px solid transparent;\n  border-radius: 12px;\n  color: #ddd;\n  text-align: left;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.options button:hover {\n  background: #303050;\n  border-color: #00d9ff;\n}\n\n.options button.correct {\n  background: #22c55e;\n  color: white;\n}\n\n.options button.wrong {\n  background: #ef4444;\n  color: white;\n}\n\n.score {\n  margin-top: 25px;\n  text-align: center;\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: #00d9ff;\n}`, js: `const questions = [\n  { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup', 'None'], answer: 0 },\n  { q: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], answer: 1 },\n  { q: 'What does JS stand for?', options: ['JavaSource', 'JavaScript', 'JustScript', 'None'], answer: 1 }\n];\nlet current = 0;\nlet score = 0;\nconst qEl = document.querySelector('.question p');\nconst qNum = document.querySelector('.q-num');\nconst options = document.querySelectorAll('.options button');\nconst scoreEl = document.querySelector('.score');\n\nconst loadQuestion = () => {\n  qEl.textContent = questions[current].q;\n  qNum.textContent = 'Q' + (current + 1);\n  options.forEach((btn, i) => {\n    btn.textContent = questions[current].options[i];\n    btn.className = '';\n    btn.onclick = () => {\n      if (i === questions[current].answer) {\n        btn.classList.add('correct');\n        score++;\n      } else {\n        btn.classList.add('wrong');\n      }\n      scoreEl.textContent = 'Score: ' + score;\n      setTimeout(() => {\n        current++;\n        if (current < questions.length) loadQuestion();\n        else {\n          qEl.textContent = 'Quiz Complete!';\n          qNum.textContent = '✓';\n          options.forEach(btn => btn.style.display = 'none');\n        }\n      }, 800);\n    };\n  });\n};\n\nloadQuestion();`, category: 'Game', difficulty: 'Beginner' },
  { id: 6, name: 'BMI Calculator', html: `<div class="bmi-app">\n  <h2>BMI Calculator</h2>\n  <div class="inputs">\n    <div class="input-group">\n      <label>Height (cm)</label>\n      <input type="number" value="170" id="height">\n    </div>\n    <div class="input-group">\n      <label>Weight (kg)</label>\n      <input type="number" value="70" id="weight">\n    </div>\n  </div>\n  <button class="calculate">Calculate BMI</button>\n  <div class="result">\n    <div class="bmi-value">24.2</div>\n    <div class="bmi-status">Normal</div>\n  </div>\n  <div class="scale">\n    <div class="scale-item under">Underweight</div>\n    <div class="scale-item normal">Normal</div>\n    <div class="scale-item over">Overweight</div>\n    <div class="scale-item obese">Obese</div>\n  </div>\n</div>`, css: `.bmi-app {\n  background: #1a1a2e;\n  border-radius: 24px;\n  padding: 35px;\n  width: 340px;\n}\n\nh2 {\n  color: #fff;\n  text-align: center;\n  margin-bottom: 25px;\n}\n\n.inputs {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 15px;\n  margin-bottom: 20px;\n}\n\n.input-group label {\n  display: block;\n  color: #888;\n  font-size: 0.85rem;\n  margin-bottom: 8px;\n}\n\n.input-group input {\n  width: 100%;\n  padding: 14px;\n  background: #252542;\n  border: 2px solid #333;\n  border-radius: 12px;\n  color: #fff;\n  font-size: 1.1rem;\n  box-sizing: border-box;\n}\n\n.input-group input:focus {\n  outline: none;\n  border-color: #00d9ff;\n}\n\n.calculate {\n  width: 100%;\n  padding: 16px;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  border: none;\n  border-radius: 12px;\n  color: white;\n  font-weight: bold;\n  font-size: 1rem;\n  cursor: pointer;\n}\n\n.result {\n  text-align: center;\n  margin: 25px 0;\n  padding: 20px;\n  background: #252542;\n  border-radius: 16px;\n}\n\n.bmi-value {\n  font-size: 3rem;\n  font-weight: bold;\n  color: #00d9ff;\n}\n\n.bmi-status {\n  font-size: 1.2rem;\n  color: #22c55e;\n}\n\n.scale {\n  display: flex;\n  gap: 8px;\n  font-size: 0.65rem;\n}\n\n.scale-item {\n  flex: 1;\n  padding: 8px 4px;\n  text-align: center;\n  border-radius: 8px;\n}\n\n.scale-item.under { background: #3b82f6; }\n.scale-item.normal { background: #22c55e; }\n.scale-item.over { background: #f59e0b; }\n.scale-item.obese { background: #ef4444; }`, js: `const heightInput = document.getElementById('height');\nconst weightInput = document.getElementById('weight');\nconst calcBtn = document.querySelector('.calculate');\nconst bmiValue = document.querySelector('.bmi-value');\nconst bmiStatus = document.querySelector('.bmi-status');\n\nconst calculate = () => {\n  const h = parseFloat(heightInput.value) / 100;\n  const w = parseFloat(weightInput.value);\n  if (!h || !w) return;\n  const bmi = (w / (h * h)).toFixed(1);\n  bmiValue.textContent = bmi;\n  let status, color;\n  if (bmi < 18.5) { status = 'Underweight'; color = '#3b82f6'; }\n  else if (bmi < 25) { status = 'Normal'; color = '#22c55e'; }\n  else if (bmi < 30) { status = 'Overweight'; color = '#f59e0b'; }\n  else { status = 'Obese'; color = '#ef4444'; }\n  bmiStatus.textContent = status;\n  bmiStatus.style.color = color;\n};\n\ncalcBtn.addEventListener('click', calculate);\ncalculate();`, category: 'Utility', difficulty: 'Beginner' },
  { id: 7, name: 'Stopwatch', html: `<div class="stopwatch">\n  <div class="display">00:00:00</div>\n  <div class="controls">\n    <button class="start">Start</button>\n    <button class="stop">Stop</button>\n    <button class="reset">Reset</button>\n  </div>\n  <div class="laps">\n    <h3>Laps</h3>\n    <ul></ul>\n  </div>\n</div>`, css: `.stopwatch {\n  background: #0a0a0f;\n  padding: 40px;\n  border-radius: 24px;\n  width: 320px;\n  text-align: center;\n}\n\n.display {\n  font-size: 4rem;\n  font-weight: bold;\n  color: #00d9ff;\n  font-family: 'Courier New', monospace;\n  text-shadow: 0 0 30px rgba(0, 217, 255, 0.4);\n  margin-bottom: 30px;\n}\n\n.controls {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n  margin-bottom: 30px;\n}\n\n.controls button {\n  padding: 14px 28px;\n  border: none;\n  border-radius: 12px;\n  font-weight: bold;\n  cursor: pointer;\n  transition: transform 0.1s;\n}\n\n.controls button:active {\n  transform: scale(0.95);\n}\n\n.start {\n  background: #22c55e;\n  color: white;\n}\n\n.stop {\n  background: #ef4444;\n  color: white;\n}\n\n.reset {\n  background: #666;\n  color: white;\n}\n\n.laps {\n  text-align: left;\n}\n\n.laps h3 {\n  color: #666;\n  font-size: 0.9rem;\n  margin-bottom: 10px;\n}\n\n.laps ul {\n  list-style: none;\n  padding: 0;\n  max-height: 150px;\n  overflow-y: auto;\n}\n\n.laps li {\n  padding: 10px;\n  background: #1a1a2e;\n  border-radius: 8px;\n  margin-bottom: 8px;\n  color: #00d9ff;\n  font-family: monospace;\n}`, js: `let running = false;\nlet time = 0;\nlet interval = null;\nconst display = document.querySelector('.display');\nconst startBtn = document.querySelector('.start');\nconst stopBtn = document.querySelector('.stop');\nconst resetBtn = document.querySelector('.reset');\nconst lapsList = document.querySelector('.laps ul');\n\nconst formatTime = (ms) => {\n  const mins = Math.floor(ms / 60000).toString().padStart(2, '0');\n  const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');\n  const centis = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');\n  return mins + ':' + secs + ':' + centis;\n};\n\nstartBtn.addEventListener('click', () => {\n  if (!running) {\n    running = true;\n    interval = setInterval(() => {\n      time += 10;\n      display.textContent = formatTime(time);\n    }, 10);\n  }\n});\n\nstopBtn.addEventListener('click', () => {\n  running = false;\n  clearInterval(interval);\n});\n\nresetBtn.addEventListener('click', () => {\n  running = false;\n  clearInterval(interval);\n  time = 0;\n  display.textContent = '00:00:00';\n  lapsList.innerHTML = '';\n});\n\ndisplay.addEventListener('dblclick', () => {\n  if (running) {\n    const li = document.createElement('li');\n    li.textContent = formatTime(time);\n    lapsList.insertBefore(li, lapsList.firstChild);\n  }\n});`, category: 'Utility', difficulty: 'Beginner' },
  { id: 8, name: 'Color Generator', html: `<div class="color-gen">\n  <div class="color-box"></div>\n  <div class="hex-code">#667eea</div>\n  <button class="generate">Generate Color</button>\n  <div class="palette">\n    <div class="palette-color"></div>\n    <div class="palette-color"></div>\n    <div class="palette-color"></div>\n    <div class="palette-color"></div>\n    <div class="palette-color"></div>\n  </div>\n</div>`, css: `.color-gen {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 40px;\n  background: #1a1a2e;\n  border-radius: 24px;\n  width: 340px;\n}\n\n.color-box {\n  width: 200px;\n  height: 200px;\n  border-radius: 20px;\n  background: #667eea;\n  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);\n  margin-bottom: 20px;\n  transition: all 0.3s;\n}\n\n.hex-code {\n  font-size: 2.5rem;\n  font-weight: bold;\n  color: #fff;\n  font-family: monospace;\n  margin-bottom: 25px;\n}\n\n.generate {\n  padding: 16px 40px;\n  background: linear-gradient(135deg, #ff6b35, #f7931e);\n  border: none;\n  border-radius: 12px;\n  color: white;\n  font-weight: bold;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n\n.generate:hover {\n  transform: scale(1.05);\n}\n\n.palette {\n  display: flex;\n  gap: 10px;\n  margin-top: 25px;\n}\n\n.palette-color {\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n\n.palette-color:hover {\n  transform: scale(1.2);\n}`, js: `const colorBox = document.querySelector('.color-box');\nconst hexCode = document.querySelector('.hex-code');\nconst generateBtn = document.querySelector('.generate');\nconst paletteColors = document.querySelectorAll('.palette-color');\n\nconst randomColor = () => {\n  const chars = '0123456789abcdef';\n  let hex = '#';\n  for (let i = 0; i < 6; i++) {\n    hex += chars[Math.floor(Math.random() * 16)];\n  }\n  return hex;\n};\n\nconst setColor = (color) => {\n  colorBox.style.background = color;\n  colorBox.style.boxShadow = '0 20px 40px ' + color + '66';\n  hexCode.textContent = color;\n};\n\nconst generate = () => {\n  const newColor = randomColor();\n  setColor(newColor);\n  paletteColors.forEach(pc => {\n    pc.style.background = randomColor();\n    pc.onclick = () => setColor(pc.style.background);\n  });\n};\n\ngenerateBtn.addEventListener('click', generate);\ngenerate();`, category: 'Utility', difficulty: 'Beginner' },
  { id: 9, name: 'Tic Tac Toe', html: `<div class="tic-tac-toe">\n  <h2>Tic Tac Toe</h2>\n  <div class="status">Player X's Turn</div>\n  <div class="board">\n    <div class="cell" data-index="0"></div>\n    <div class="cell" data-index="1"></div>\n    <div class="cell" data-index="2"></div>\n    <div class="cell" data-index="3"></div>\n    <div class="cell" data-index="4"></div>\n    <div class="cell" data-index="5"></div>\n    <div class="cell" data-index="6"></div>\n    <div class="cell" data-index="7"></div>\n    <div class="cell" data-index="8"></div>\n  </div>\n  <button class="restart">Restart Game</button>\n</div>`, css: `.tic-tac-toe {\n  background: #1a1a2e;\n  padding: 35px;\n  border-radius: 24px;\n  width: 320px;\n  text-align: center;\n}\n\nh2 {\n  color: #fff;\n  margin-bottom: 10px;\n}\n\n.status {\n  color: #888;\n  margin-bottom: 20px;\n  font-size: 0.95rem;\n}\n\n.board {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n  margin-bottom: 25px;\n}\n\n.cell {\n  width: 80px;\n  height: 80px;\n  background: #252542;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2.5rem;\n  font-weight: bold;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.cell:hover {\n  background: #303050;\n}\n\n.cell.x {\n  color: #00d9ff;\n}\n\n.cell.o {\n  color: #ff6b35;\n}\n\n.cell.winner {\n  background: #22c55e;\n}\n\n.restart {\n  padding: 14px 30px;\n  background: #333;\n  border: none;\n  border-radius: 12px;\n  color: #fff;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n.restart:hover {\n  background: #444;\n}`, js: `let board = ['', '', '', '', '', '', '', '', ''];\nlet currentPlayer = 'X';\nlet gameOver = false;\nconst cells = document.querySelectorAll('.cell');\nconst status = document.querySelector('.status');\nconst restartBtn = document.querySelector('.restart');\n\nconst wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];\n\nconst checkWinner = () => {\n  for (let w of wins) {\n    const [a, b, c] = w;\n    if (board[a] && board[a] === board[b] && board[a] === board[c]) {\n      gameOver = true;\n      status.textContent = 'Player ' + board[a] + ' Wins!';\n      cells[a].classList.add('winner');\n      cells[b].classList.add('winner');\n      cells[c].classList.add('winner');\n      return true;\n    }\n  }\n  if (!board.includes('')) {\n    gameOver = true;\n    status.textContent = 'Draw!';\n    return true;\n  }\n  return false;\n};\n\ncells.forEach((cell, i) => {\n  cell.addEventListener('click', () => {\n    if (!gameOver && board[i] === '') {\n      board[i] = currentPlayer;\n      cell.textContent = currentPlayer;\n      cell.classList.add(currentPlayer.toLowerCase());\n      if (!checkWinner()) {\n        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';\n        status.textContent = 'Player ' + currentPlayer + '\\'s Turn';\n      }\n    }\n  });\n});\n\nrestartBtn.addEventListener('click', () => {\n  board = ['', '', '', '', '', '', '', '', ''];\n  currentPlayer = 'X';\n  gameOver = false;\n  status.textContent = 'Player X\\'s Turn';\n  cells.forEach(cell => {\n    cell.textContent = '';\n    cell.className = 'cell';\n  });\n});`, category: 'Game', difficulty: 'Beginner' },
  { id: 10, name: 'Random Quote', html: `<div class="quote-app">\n  <div class="quote-box">\n    <div class="quote">"The only way to do great work is to love what you do."</div>\n    <div class="author">- Steve Jobs</div>\n  </div>\n  <button class="new-quote">New Quote</button>\n  <div class="buttons">\n    <button class="copy">Copy</button>\n    <button class="share">Share</button>\n  </div>\n</div>`, css: `.quote-app {\n  background: linear-gradient(135deg, #1e1745 0%, #0d0d1a 100%);\n  padding: 40px;\n  border-radius: 24px;\n  width: 380px;\n  text-align: center;\n}\n\n.quote-box {\n  background: rgba(255,255,255,0.05);\n  padding: 30px;\n  border-radius: 16px;\n  margin-bottom: 25px;\n  position: relative;\n}\n\n.quote-box::before {\n  content: '"';\n  font-size: 4rem;\n  color: #667eea;\n  position: absolute;\n  top: -10px;\n  left: 10px;\n  opacity: 0.5;\n}\n\n.quote {\n  font-size: 1.3rem;\n  color: #fff;\n  line-height: 1.6;\n  font-style: italic;\n  margin-bottom: 15px;\n}\n\n.author {\n  color: #667eea;\n  font-size: 1rem;\n  font-weight: bold;\n}\n\n.new-quote {\n  width: 100%;\n  padding: 16px;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  border: none;\n  border-radius: 12px;\n  color: white;\n  font-weight: bold;\n  font-size: 1rem;\n  cursor: pointer;\n  margin-bottom: 15px;\n}\n\n.buttons {\n  display: flex;\n  gap: 12px;\n}\n\n.buttons button {\n  flex: 1;\n  padding: 12px;\n  background: rgba(255,255,255,0.1);\n  border: none;\n  border-radius: 10px;\n  color: #aaa;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.buttons button:hover {\n  background: rgba(255,255,255,0.2);\n  color: white;\n}`, js: `const quotes = [\n  { q: 'The only way to do great work is to love what you do.', a: 'Steve Jobs' },\n  { q: 'Innovation distinguishes between a leader and a follower.', a: 'Steve Jobs' },\n  { q: 'Stay hungry, stay foolish.', a: 'Steve Jobs' },\n  { q: 'Code is like humor. When you have to explain it, it\\'s bad.', a: 'Cory House' },\n  { q: 'First, solve the problem. Then, write the code.', a: 'John Johnson' },\n  { q: 'Experience is the name everyone gives to their mistakes.', a: 'Oscar Wilde' }\n];\n\nconst quoteEl = document.querySelector('.quote');\nconst authorEl = document.querySelector('.author');\nconst newQuoteBtn = document.querySelector('.new-quote');\nconst copyBtn = document.querySelector('.copy');\n\nconst getQuote = () => {\n  const quote = quotes[Math.floor(Math.random() * quotes.length)];\n  quoteEl.textContent = '"' + quote.q + '"';\n  authorEl.textContent = '- ' + quote.a;\n};\n\nnewQuoteBtn.addEventListener('click', getQuote);\ncopyBtn.addEventListener('click', () => {\n  const text = quoteEl.textContent + ' ' + authorEl.textContent;\n  navigator.clipboard.writeText(text);\n  copyBtn.textContent = 'Copied!';\n  setTimeout(() => copyBtn.textContent = 'Copy', 1500);\n});\n\ngetQuote();`, category: 'API', difficulty: 'Beginner' }
];

export default function ProjectGenerator() {
  const [activeProject, setActiveProject] = useState(0);
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState(PROJECT_IDEAS[0].html);
  const [cssCode, setCssCode] = useState(PROJECT_IDEAS[0].css);
  const [jsCode, setJsCode] = useState(PROJECT_IDEAS[0].js);
  const [viewMode, setViewMode] = useState('desktop');
  const [copied, setCopied] = useState({});
  const iframeRef = useRef(null);
  const [todayProjectIndex, setTodayProjectIndex] = useState(0);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setTodayProjectIndex(dayOfYear % PROJECT_IDEAS.length);
    setActiveProject(dayOfYear % PROJECT_IDEAS.length);
  }, []);

  useEffect(() => {
    setHtmlCode(PROJECT_IDEAS[activeProject].html);
    setCssCode(PROJECT_IDEAS[activeProject].css);
    setJsCode(PROJECT_IDEAS[activeProject].js);
  }, [activeProject]);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${cssCode}</style>
        </head>
        <body style="margin:0;padding:0;background:#000;min-height:100vh;">
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
        </html>
      `;
      iframe.srcdoc = htmlContent;
    }
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    if (iframeRef.current && !iframeRef.current.srcdoc) {
      const iframe = iframeRef.current;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${PROJECT_IDEAS[0].css}</style>
        </head>
        <body style="margin:0;padding:0;background:#000;min-height:100vh;">
          ${PROJECT_IDEAS[0].html}
          <script>${PROJECT_IDEAS[0].js}</script>
        </body>
        </html>
      `;
      iframe.srcdoc = htmlContent;
    }
  }, []);

  const handleProjectChange = (index) => {
    setActiveProject(index);
    setActiveTab('html');
  };

  const handleCopy = (type, code) => {
    navigator.clipboard.writeText(code);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 1500);
  };

  const currentProject = PROJECT_IDEAS[activeProject];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase leading-tight">
            Project <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Daily projects • Live Preview • Learn &amp; Build
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
          <Sparkles size={16} className="text-yellow-400" />
          <span className="text-xs text-gray-400 font-black uppercase">Today&apos;s Project</span>
        </div>
      </div>

      {/* Project Ideas Carousel */}
      <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
            <Lightbulb size={16} className="text-yellow-400" />
            10 Project Ideas (Daily Rotation)
          </h3>
          <span className="text-xs text-blue-400">
            Day #{new Date().getDate()} → Project #{todayProjectIndex + 1}
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {PROJECT_IDEAS.map((project, i) => (
            <button
              key={project.id}
              onClick={() => handleProjectChange(i)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeProject === i 
                  ? 'bg-blue-600 text-white shadow-glow-blue' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {i + 1}. {project.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl overflow-hidden">
          {/* Project Info */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-black text-white">{currentProject.name}</h3>
              <span className={`text-[10px] px-2 py-1 rounded-full ${
                currentProject.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {currentProject.difficulty}
              </span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                {currentProject.category}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {[
              { id: 'html', icon: FileCode, label: 'HTML' },
              { id: 'css', icon: FileJson, label: 'CSS' },
              { id: 'js', icon: FileText, label: 'JavaScript' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Area */}
          <div className="relative">
            <textarea
              value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
              onChange={(e) => {
                if (activeTab === 'html') setHtmlCode(e.target.value);
                else if (activeTab === 'css') setCssCode(e.target.value);
                else setJsCode(e.target.value);
              }}
              className="w-full h-[400px] bg-[#08080c] p-4 text-sm font-mono text-gray-300 resize-none focus:outline-none"
              spellCheck={false}
            />
            <button
              onClick={() => handleCopy(activeTab, activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              {copied[activeTab] ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Eye size={18} className="text-green-400" />
              Live Preview
            </h3>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 bg-[#000] flex items-center justify-center overflow-auto">
            <div 
              className="bg-white transition-all duration-300"
              style={{
                width: viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '768px' : '375px',
                height: viewMode === 'desktop' ? '100%' : '600px',
                borderRadius: viewMode === 'desktop' ? '0' : '16px',
                overflow: 'hidden'
              }}
            >
              <iframe
                ref={iframeRef}
                title="preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                style={{ minHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project List for Quick Access */}
      <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6">
        <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
          <Code size={16} className="text-blue-400" />
          All Projects
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PROJECT_IDEAS.map((project, i) => (
            <button
              key={project.id}
              onClick={() => handleProjectChange(i)}
              className={`p-4 rounded-xl text-left transition-all ${
                activeProject === i 
                  ? 'bg-blue-600/20 border border-blue-500/50' 
                  : 'bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-black">{String(i + 1).padStart(2, '0')}</span>
                {i === todayProjectIndex && (
                  <Sparkles size={12} className="text-yellow-400" />
                )}
              </div>
              <p className="text-sm font-medium text-white">{project.name}</p>
              <p className="text-[10px] text-gray-500 mt-1">{project.category}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
