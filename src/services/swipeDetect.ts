class RootSwipeable {
  private readonly p_offset: number;

  private p_previous: { x: number | null };

  constructor({offset}: { offset: number }) {
    this.p_offset = offset;
    this.p_previous = {x: null};
  }

  updatePreviousState(event: TouchEvent): void {
    this.p_previous.x = event.changedTouches[0].screenX;
  }

  init(event: TouchEvent): void {
    !this.p_previous.x && this.updatePreviousState(event);
  }

  handleGesture(event: TouchEvent, {
    onLeft = () => {
    },
    onRight = () => {
    }
  }: {
    onLeft: () => void,
    onRight: () => void
  }) {

    if (!this.p_previous.x) {
      return;
    }
    let screenX = event.changedTouches[0].screenX;

    if (this.p_previous.x + this.p_offset < screenX) {
      this.updatePreviousState(event);
      onRight();
      return;
    }

    if (this.p_previous.x - this.p_offset > screenX) {
      this.updatePreviousState(event);
      onLeft();
    }
  }

  kill() {
    this.p_previous = {x: null}
  }

}

export default class SwipeableService {

  root: RootSwipeable;
  pageWidth: number;
  minSwipe: number;
  touchstart: { x: number };
  touchend: { x: number };

  constructor({offset}: { offset: number }) {
    this.root = new RootSwipeable({offset})
    this.pageWidth = window.innerWidth || document.body.clientWidth
    this.minSwipe = Math.max(1, Math.floor(0.01 * (this.pageWidth)))
    this.touchstart = {x: 0}
    this.touchend = {x: 0}
  }

  touchStart(event: TouchEvent) {
    this.root.init(event)
    this.touchstart.x = event.changedTouches[0].screenX
  }

  touchMove(event: TouchEvent, {
    onLeft = () => {
    },
    onRight = () => {
    },
  }) {

    this.touchend.x = event.changedTouches[0].screenX;
    this.handleGesture(event, {onLeft, onRight})
  }

  handleGesture(event: TouchEvent,
                {onLeft, onRight}:
                  {
                    onLeft: (e: TouchEvent, x: number) => void,
                    onRight: (e: TouchEvent, x: number) => void
                  }
  ) {

    let x = this.touchend.x - this.touchstart.x;
    if (Math.abs(x) > this.minSwipe) {
      this.root.handleGesture(event, {
        onRight: () => onRight(event, x),
        onLeft: () => onLeft(event, x)
      })

    }

  }

  touchEnd() {
    this.root.kill()
    this.touchstart = {x: 0}
    this.touchend = {x: 0}
  }

}