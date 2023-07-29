//to check that it's the right direction.
const log = x => console.log(x)

class RootSwipeable {
    constructor({ offset }) {
        this.offset = offset
        this.previous = { x: null}
    }

    updatePrevious(e) {
        this.previous.x =  e.changedTouches[0].screenX
    }

    init(e) {
        !this.previous.x && this.updatePrevious(e);
    }

    handleGesture(e, {onLeft = () => { }, onRight = () => { } }) {
        let screenX =  e.changedTouches[0].screenX;

        if (this.previous.x + this.offset < screenX) {
            log('right')
            this.updatePrevious(e)
            onRight()
            return
        }
        if (this.previous.x - this.offset > screenX) {
            log('left')
            this.updatePrevious(e)
            onLeft()
        }
    }

    kill() { this.previous = { x: null } }
}

export default class Swipeable {
    constructor({ offset }) {
        this.root = new RootSwipeable({ offset })
        this.pageWidth = window.innerWidth || document.body.clientWidth
        this.minSwipe = Math.max(1, Math.floor(0.01 * (this.pageWidth)))
        this.touchstart = { x: 0}
        this.touchend = { x: 0}
        this.limit = Math.tan(45 * 1.5 / 180 * Math.PI)
    }

    touchStart(e) {
        this.root.init(e)
        this.touchstart.x = e.changedTouches[0].screenX
    }
    touchMove(e, {
        onLeft = () => { },
        onRight = () => { },
    }) {
        this.touchend.x = e.changedTouches[0].screenX;
        this.handleGesture(e, { onLeft, onRight })
    }

    handleGesture(e, { onLeft, onRight }) {
        let x = this.touchend.x - this.touchstart.x;

        if (Math.abs(x) > this.minSwipe) {
            this.root.handleGesture(e, {
                onRight: () => onRight(e, x),
                onLeft: () => onLeft(e, x)
            })
        }
    }

    touchEnd() {
        this.root.kill()
        this.touchstart = { x: 0}
        this.touchend = { x: 0}
    }
}