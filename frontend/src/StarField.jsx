import { useEffect, useRef } from "react";
import "./StarField.css"

export default function StarField(){
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationId;

        function resize(){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize)

        const stars = Array.from({ length: 150}, () =>({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2 + 0.3,
            alpha: Math.random() * 0.5 + 0.5,
            twinkleSpeed: (Math.random() * 0.01 + 0.002) * (Math.random() < 0.5 ? 1: -1),
        }));

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {

                star.alpha += star.twinkleSpeed;
                if(star.alpha > 1 || star.alpha < 0.2)
                {
                    star.twinkleSpeed *= -1;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });

            animationId = requestAnimationFrame(draw);
        }
        draw();

        return() => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };

    }, []);

    return <canvas ref={canvasRef} className="starfield" />;
} 