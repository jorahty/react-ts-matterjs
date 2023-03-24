import { Engine, Bodies, Composite, Render, Runner } from 'matter-js';
import { useEffect, useRef } from "react";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    container && renderToCanvas(container);
  }, []);

  return (
    <div ref={containerRef} />
  );
}

function renderToCanvas(container: HTMLDivElement) {
  if (container.childElementCount > 0) return;

  // create an engine
  const engine = Engine.create();
  engine.world.gravity.scale *= 0.1;

  // create a renderer
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: 800,
      height: 800,
      wireframes: false,
      background: '#1E1E1E',
    },
  });

  const ball = Bodies.circle(400, 100, 30, { render: { fillStyle: '#23BE57' } });

  const wallOptions = { isStatic: true, render: { fillStyle: '#414141' } }

  Composite.add(engine.world, [
    ball,
    Bodies.rectangle(400, 0, 800, 50, wallOptions),
    Bodies.rectangle(400, 800, 800, 50, wallOptions),
    Bodies.rectangle(800, 400, 50, 800, wallOptions),
    Bodies.rectangle(0, 400, 50, 800, wallOptions)
  ]);

  // run the renderer
  Render.run(render);

  // create runner
  const runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  setInterval(() => {
    const f = 0.0002;
    const g = 0.1;
    ball.force = {
      x: (400 - ball.position.x) * f + (-g + Math.random() * g * 2),
      y: (400 - ball.position.y) * f + (-g + Math.random() * g * 2),
    };
  }, 1000);
}
