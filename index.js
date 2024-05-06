let startDate = new Date(2023, 3, 27, 14, 20, 0, 0)
let endDate = new Date(2024, 4, 10, 17, 0, 0, 0)

//let startDate = new Date()
//let endDate = new Date(startDate.getTime() + 5000)

let totalDiff = new Date(endDate.getTime() - startDate.getTime())
const countdownContainer = document.querySelector('.countdown-container')
let currentDate = new Date()
let timeDiff = new Date(endDate.getTime() - currentDate.getTime())

const canvas = document.querySelector('.hourglass')
const ctx = canvas.getContext('2d')

const sandColor = '#e3af20'

let sandParticles = []

let frozen = false

function draw() {
  if (frozen) {
    requestAnimationFrame(draw)
    return
  }
  canvas.width = parseFloat(getComputedStyle(canvas).width.replace('px', ''))
  canvas.height = parseFloat(getComputedStyle(canvas).height.replace('px', ''))

  xCenter = canvas.width / 2
  yCenter = canvas.height / 2
  //yCenter = canvas.height / 2 - 250

  scale = Math.min(canvas.height * 1.3, canvas.width * 2) / 1.75
  //scale = Math.min(canvas.height * 1.3, canvas.width * 1.4) / 4

  margin = scale / 40
  hourglassWidth = (scale * 2) / 5
  hourglassHeight = (scale * 3) / 5
  angleHeight = hourglassWidth / 2
  straightHeight = hourglassHeight - angleHeight

  ctx.reset()

  drawSand()

  drawHourglass()

  //ctx.fillRect(xCenter - 5, yCenter - 5, 10, 10)

  requestAnimationFrame(draw)
}

function drawSand() {
  currentDate = new Date() //New Date
  timeDiff = new Date(endDate.getTime() - currentDate.getTime())

  let trickleArea = (margin * margin) / 4
  let angleArea = (hourglassWidth * angleHeight) / 2 - trickleArea
  let straightArea = hourglassWidth * straightHeight
  let totalArea = angleArea + straightArea

  let remainderArea = Math.min(
    Math.max((timeDiff.getTime() / totalDiff.getTime()) * totalArea, 0),
    totalArea
  )
  let usedArea = Math.min(Math.max(totalArea - remainderArea, 0), totalArea)

  if (remainderArea <= 0) {
    trigger()
  } else {
    ctx.fillStyle = sandColor

    sandParticles.push(
      new SandParticle(
        xCenter + Math.random() * margin - margin / 2,
        yCenter - margin * Math.sqrt(2),
        (4 * Math.PI) / 3 + (Math.random() * Math.PI) / 3,
        5
      )
    )
    for (let i = 0; i < sandParticles.length; i++) {
      sandParticles[i].draw()
      sandParticles[i].move()
    }

    if (remainderArea < angleArea) {
      let triangleHeight = Math.sqrt(remainderArea + trickleArea)

      ctx.fillStyle = sandColor
      ctx.beginPath()
      ctx.moveTo(
        xCenter - triangleHeight,
        yCenter + margin * (1 / 2 - Math.sqrt(2)) - triangleHeight
      )
      ctx.lineTo(xCenter, yCenter + margin * (1 / 2 - Math.sqrt(2)))
      ctx.lineTo(
        xCenter + triangleHeight,
        yCenter + margin * (1 / 2 - Math.sqrt(2)) - triangleHeight
      )
      ctx.closePath()
      ctx.fill()
    } else {
      let rectangleHeight = (remainderArea - angleArea) / hourglassWidth

      ctx.fillStyle = sandColor
      ctx.fillRect(
        xCenter - hourglassWidth / 2,
        yCenter +
          margin * (2 - 2 * Math.sqrt(2)) -
          rectangleHeight -
          angleHeight -
          0.5,
        hourglassWidth,
        rectangleHeight + 1.5
      )
      ctx.fillStyle = sandColor
      ctx.beginPath()
      ctx.moveTo(
        xCenter - hourglassWidth / 2,
        yCenter + margin * (1 / 2 - Math.sqrt(2)) - angleHeight
      )
      ctx.lineTo(xCenter, yCenter + margin * (1 / 2 - Math.sqrt(2)))
      ctx.lineTo(
        xCenter + hourglassWidth / 2,
        yCenter + margin * (1 / 2 - Math.sqrt(2)) - angleHeight
      )
      ctx.closePath()
      ctx.fill()
    }
  }

  if (usedArea < angleArea) {
    let triangleHeight = Math.sqrt(usedArea + trickleArea)

    ctx.fillStyle = sandColor
    ctx.beginPath()
    ctx.moveTo(
      xCenter - triangleHeight,
      yCenter - margin * (2 - 2 * Math.sqrt(2)) + hourglassHeight + 0.5
    )
    ctx.lineTo(
      xCenter,
      yCenter -
        margin * (2 - 2 * Math.sqrt(2)) +
        hourglassHeight -
        triangleHeight
    )
    ctx.lineTo(
      xCenter + triangleHeight,
      yCenter - margin * (2 - 2 * Math.sqrt(2)) + hourglassHeight + 0.5
    )
    ctx.closePath()
    ctx.fill()
  } else {
    let rectangleHeight = (usedArea - angleArea) / hourglassWidth

    ctx.fillStyle = sandColor
    ctx.fillRect(
      xCenter - hourglassWidth / 2,
      yCenter -
        margin * (2 - 2 * Math.sqrt(2)) +
        hourglassHeight -
        rectangleHeight -
        1,
      hourglassWidth,
      rectangleHeight + 1
    )
    ctx.fillStyle = sandColor
    ctx.beginPath()
    ctx.moveTo(
      xCenter - hourglassWidth / 2,
      yCenter -
        margin * (2 - 2 * Math.sqrt(2)) +
        hourglassHeight -
        rectangleHeight +
        0.5
    )
    ctx.lineTo(
      xCenter,
      yCenter -
        margin * (2 - 2 * Math.sqrt(2)) +
        hourglassHeight -
        rectangleHeight -
        hourglassWidth / 2
    )
    ctx.lineTo(
      xCenter + hourglassWidth / 2,
      yCenter -
        margin * (2 - 2 * Math.sqrt(2)) +
        hourglassHeight -
        rectangleHeight +
        0.5
    )
    ctx.closePath()
    ctx.fill()
  }
}

function drawHourglass() {
  ctx.fillStyle = '#cdcdcd'

  ctx.beginPath()
  ctx.moveTo(
    xCenter + hourglassWidth / 2 + margin * 2,
    yCenter - hourglassHeight - margin * 2 * Math.sqrt(2)
  ) //Top right outside
  ctx.lineTo(xCenter + hourglassWidth / 2 + margin * 2, yCenter - angleHeight) //Middle top far right outside
  ctx.lineTo(xCenter + (margin * 5) / 2, yCenter - margin / 2) //Middle top right outside
  ctx.lineTo(xCenter + (margin * 5) / 2, yCenter + margin / 2) //Middle bottom right outside
  ctx.lineTo(xCenter + hourglassWidth / 2 + margin * 2, yCenter + angleHeight) //Middle bottom far right outside
  ctx.lineTo(
    xCenter + hourglassWidth / 2 + margin * 2,
    yCenter + hourglassHeight + margin * 2 * Math.sqrt(2)
  ) //Bottom right outside
  ctx.lineTo(
    xCenter - hourglassWidth / 2 - margin * 2,
    yCenter + hourglassHeight + margin * 2 * Math.sqrt(2)
  ) //Bottom left outside
  ctx.lineTo(xCenter - hourglassWidth / 2 - margin * 2, yCenter + angleHeight) //Middle bottom far left outside
  ctx.lineTo(xCenter - (margin * 5) / 2, yCenter + margin / 2) //Middle bottom left outside
  ctx.lineTo(xCenter - (margin * 5) / 2, yCenter - margin / 2) //Middle top left outside
  ctx.lineTo(xCenter - hourglassWidth / 2 - margin * 2, yCenter - angleHeight) //Middle top far left outside
  ctx.lineTo(
    xCenter - hourglassWidth / 2 - margin * 2,
    yCenter - hourglassHeight - margin * 2 * Math.sqrt(2)
  ) //Top left outside

  ctx.moveTo(
    xCenter - hourglassWidth / 2 - margin,
    yCenter + margin * (1 - 2 * Math.sqrt(2)) - hourglassHeight
  ) //Top left inside
  ctx.lineTo(
    xCenter - hourglassWidth / 2 - margin,
    yCenter + margin * (1 - Math.sqrt(2)) - angleHeight
  ) //Middle top far left inside
  ctx.lineTo(
    xCenter - (margin * 3) / 2,
    yCenter + margin * (1 / 2 - Math.sqrt(2))
  ) //Middle top left inside
  ctx.lineTo(
    xCenter - (margin * 3) / 2,
    yCenter - margin * (1 / 2 - Math.sqrt(2))
  ) //Middle bottom left inside
  ctx.lineTo(
    xCenter - hourglassWidth / 2 - margin,
    yCenter - margin * (1 - Math.sqrt(2)) + angleHeight
  ) //Middle bottom far left inside
  ctx.lineTo(
    xCenter - hourglassWidth / 2 - margin,
    yCenter - margin * (1 - 2 * Math.sqrt(2)) + hourglassHeight
  ) //Bottom left inside
  ctx.lineTo(
    xCenter + hourglassWidth / 2 + margin,
    yCenter - margin * (1 - 2 * Math.sqrt(2)) + hourglassHeight
  ) //Bottom right inside
  ctx.lineTo(
    xCenter + hourglassWidth / 2 + margin,
    yCenter - margin * (1 - Math.sqrt(2)) + angleHeight
  ) //Middle bottom far right inside
  ctx.lineTo(
    xCenter + (margin * 3) / 2,
    yCenter - margin * (1 / 2 - Math.sqrt(2))
  ) //Middle bottom right inside
  ctx.lineTo(
    xCenter + (margin * 3) / 2,
    yCenter + margin * (1 / 2 - Math.sqrt(2))
  ) //Middle top right inside
  ctx.lineTo(
    xCenter + hourglassWidth / 2 + margin,
    yCenter + margin * (1 - Math.sqrt(2)) - angleHeight
  ) //Middle top far right inside
  ctx.lineTo(
    xCenter + hourglassWidth / 2 + margin,
    yCenter + margin * (1 - 2 * Math.sqrt(2)) - hourglassHeight
  ) //Top right inside
  ctx.closePath()
  ctx.fill()
}

setInterval(() => {
  updateTimer()
}, 1000)

function parseTimer() {
  const days = String(Math.floor(timeDiff / (1000 * 60 * 60 * 24))).padStart(
    2,
    '0'
  )
  const hours = String(
    Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  ).padStart(2, '0')
  const minutes = String(
    Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  ).padStart(2, '0')
  const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(
    2,
    '0'
  )

  return `${days} ${hours} ${minutes} ${seconds}`
}

function updateTimer() {
  countdownContainer.innerHTML = ''
  let timeArray = parseTimer().split(' ')
  // split each element of the array into individual digits
  timeArray = timeArray.map(time => time.split(''))

  function createTimeElement(time, className, unit, digits) {
    let timeElement = document.createElement('span')
    timeElement.classList.add(className)
    countdownContainer.appendChild(timeElement)

    for (let i = 0; i < digits; i++) {
      let digit = document.createElement('span')
      digit.classList.add('digit')
      digit.textContent = time[i]
      timeElement.appendChild(digit)
    }

    timeElement.innerHTML += unit + ' '
  }

  // Days
  createTimeElement(timeArray[0], 'days', 'D', 3)
  // Hours
  createTimeElement(timeArray[1], 'hours', 'H', 2)
  // Minutes
  createTimeElement(timeArray[2], 'minutes', 'M', 2)
  // Seconds
  createTimeElement(timeArray[3], 'seconds', 'S', 2)
}

function trigger() {
  const spinSpeed = 5000 // ms
  countdownContainer.style.opacity = 0

  setTimeout(() => {
    const r = document.querySelector(':root')
    r.style.setProperty('--spin-speed', spinSpeed / 1000 + 's')

    const canvasContainer = document.querySelector('.canvas-container')
    canvasContainer.classList.add('spin')
    frozen = true
    setTimeout(() => {
      startDate = new Date()
      endDate = new Date()
      endDate.setFullYear(startDate.getFullYear() + 1)
      //endDate.setSeconds(startDate.getSeconds() + 7)
      currentDate = new Date() //New Date
      timeDiff = new Date(endDate.getTime() - currentDate.getTime())
      totalDiff = new Date(endDate.getTime() - startDate.getTime())
      updateTimer()
      canvasContainer.classList.remove('spin') // returns it
      frozen = false
      countdownContainer.style.opacity = 1
    }, spinSpeed)
  }, 1000)
}

class SandParticle {
  constructor(x, y, angle, speed) {
    this.x = x
    this.y = y
    this.angle = angle
    this.speed = speed
    this.size = scale / 175

    this.xRatio = this.x / canvas.width
    this.yRatio = this.y / canvas.height

    this.dx = speed * Math.cos(this.angle)
    this.dy = speed * -Math.sin(this.angle)
    sandParticles.push(this)
  }

  move() {
    this.x = this.xRatio * canvas.width
    this.y = this.yRatio * canvas.height

    if (
      this.x + this.dx <= xCenter - margin / 2 ||
      this.x + this.dx >= xCenter + margin / 2
    ) {
      this.dx = -this.dx
      return
    }

    if (
      this.y + this.dy >=
      yCenter + margin * (2 * Math.sqrt(2) - 2) + hourglassHeight - 3
    ) {
      sandParticles.splice(sandParticles.indexOf(this), 1)
      return
    }

    this.x += this.dx
    this.y += this.dy

    this.xRatio = this.x / canvas.width
    this.yRatio = this.y / canvas.height
  }

  draw() {
    this.size = scale / 175

    ctx.fillStyle = sandColor
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    )
  }
}

updateTimer()

draw()

//document.onclick = trigger
