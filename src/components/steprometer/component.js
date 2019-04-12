const courses = require("../../courses");
module.exports = class {
  onInput(input, out) {
    this.state = {
      playing: false,
      append: '',
      step: 'Click start',
      index: -1,
      bpm: 750,
      countIn: true,
      random: false,
      e2nd: false,
      courses,
    };
  }

  onMount() {
    this.tick = new Audio('/static/tick.wav'); // length 00:00:200
  }

  next() {
    const { random, index, courses } = this.state
    if (this.steps.length) {
      this.state.index = random ?
      Math.trunc(Math.random() * this.steps.length) :
      index < this.steps.length - 1 ? index + 1 : 0

      const step = this.steps[this.state.index]
      this.count = step.length
      return step.name
    }
    return undefined
  }

  toggle(key, value) {
    this.state[key] = value
  }

  expand(course) {
    course.expanded = !course.expanded
    this.setStateDirty('courses')
  }

  select(step) { // Course index, Step index
    step.selected = !step.selected
    this.steps = [].concat.apply([], courses.map(c => c.steps.filter(s => s.selected)))
    this.setStateDirty('courses')
  }

  metronome(start) {
    this.timeout = setTimeout(() => {
      this.tick.play()
      if (!Array.isArray(start) || !start.length) {
        this.state.append = ''
        this.count = this.count - 1
        this.state.step = this.count ?  this.state.step : this.next()
      } else {
        this.state.append = start.pop()
      }
      this.metronome(start);
    }, this.state.bpm);
  }

  speed(bpm) {
    this.state.bpm = bpm
  }

  start() {
    this.steps = [].concat.apply([], courses.map(c => c.steps.filter(s => s.selected)))
    if (this.steps.length) {
      this.state.playing = true
      clearTimeout(this.timeout)
      this.metronome(this.state.countIn && [8, 7, 6])
      this.state.step = this.next()
    } else {
      this.state.step = 'Select steps'
    }
  }

  stop() {
    this.state.playing = false
    clearTimeout(this.timeout)
  }
};
