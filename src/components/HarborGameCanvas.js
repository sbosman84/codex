export const HarborGameCanvas = {
  name: 'HarborGameCanvas',
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    shipState: {
      type: Object,
      required: true,
    },
    harborWalls: {
      type: Array,
      required: true,
    },
    berthOutline: {
      type: Array,
      required: true,
    },
  },
  methods: {
    drawScene() {
      const canvasElement = this.$refs.canvasElement;
      const ctx = canvasElement.getContext('2d');

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#0b15b8';
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.fillStyle = '#978a7b';
      this.harborWalls.forEach((wall) => {
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      });

      ctx.strokeStyle = '#1ae51a';
      ctx.lineWidth = 3;
      ctx.beginPath();

      this.berthOutline.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
          return;
        }

        ctx.lineTo(point.x, point.y);
      });

      ctx.closePath();
      ctx.stroke();

      ctx.save();
      ctx.translate(this.shipState.x, this.shipState.y);
      ctx.rotate(this.shipState.angle);
      ctx.fillStyle = '#afafaf';
      ctx.fillRect(-8, -27, 16, 54);
      ctx.fillStyle = '#ca3939';
      ctx.fillRect(-3.5, -24, 7, 48);
      ctx.strokeStyle = '#efefef';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-8, -27, 16, 54);
      ctx.restore();
    },
  },
  mounted() {
    this.drawScene();
  },
  updated() {
    this.drawScene();
  },
  template: '<canvas ref="canvasElement" :width="width" :height="height"></canvas>',
};
