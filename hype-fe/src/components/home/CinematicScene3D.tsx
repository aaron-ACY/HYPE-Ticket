import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CinematicScene3DProps {
  className?: string;
  heroEventTitle?: string;
}

export const CinematicScene3D: React.FC<CinematicScene3DProps> = ({
  className = "",
  heroEventTitle = "HYPE WORLD 2026",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean any prior canvases from container to prevent duplicate WebGL contexts on reload
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 1. Scene Setup (Crystal clear without foggy wash)
    const scene = new THREE.Scene();

    // 2. Camera Setup (Optimized Perspective)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.6);

    // 3. Renderer with Optimized Settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Three-Point Cinematic Lighting Setup (Clean Titanium Studio Lighting)
    const fillLight = new THREE.DirectionalLight(0xffffff, 2.8);
    fillLight.position.set(-2, 4, 4);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Crisp Silver Titanium Key Light
    const keyLight = new THREE.PointLight(0xffffff, 2.4, 12);
    keyLight.position.set(3.5, 2.5, 3.5);
    scene.add(keyLight);

    // Soft Titanium Rim Light
    const whiteRimLight = new THREE.PointLight(0xffffff, 1.8, 12);
    whiteRimLight.position.set(-3.5, -2.5, 2.5);
    scene.add(whiteRimLight);

    // 5. Pre-render High-Res Texture
    const createPassCanvas = () => {
      const cvs = document.createElement("canvas");
      cvs.width = 1600;
      cvs.height = 800;
      const ctx = cvs.getContext("2d");
      if (!ctx) return null;

      // Dark Titanium Base (#08080C -> #12121A)
      ctx.fillStyle = "#08080C";
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      const grad = ctx.createLinearGradient(0, 0, cvs.width, cvs.height);
      grad.addColorStop(0, "#08080C");
      grad.addColorStop(0.35, "#0E0E14");
      grad.addColorStop(0.7, "#14141E");
      grad.addColorStop(1, "#07070B");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Fine Technical Precision Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1.5;
      const step = 40;
      for (let x = 0; x < cvs.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cvs.height);
        ctx.stroke();
      }
      for (let y = 0; y < cvs.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cvs.width, y);
        ctx.stroke();
      }

      // Satin Titanium Sheen Layer
      const satinGrad = ctx.createLinearGradient(0, 0, cvs.width, cvs.height);
      satinGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      satinGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.02)");
      satinGrad.addColorStop(1, "rgba(255, 255, 255, 0.04)");
      ctx.fillStyle = satinGrad;
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Laser-etched Metallic Outer Border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, cvs.width - 60, cvs.height - 60);

      // High-Contrast Pure Silver-Titanium Inset Border
      const rimGrad = ctx.createLinearGradient(40, 40, cvs.width - 80, cvs.height - 80);
      rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
      rimGrad.addColorStop(0.3, "rgba(203, 213, 225, 0.35)");
      rimGrad.addColorStop(0.7, "rgba(148, 163, 184, 0.25)");
      rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.5)");
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, cvs.width - 80, cvs.height - 80);

      // Pure Silver-Titanium Header Bar
      const headerBar = ctx.createLinearGradient(60, 60, cvs.width - 120, 60);
      headerBar.addColorStop(0, "#FFFFFF");
      headerBar.addColorStop(0.3, "#CBD5E1");
      headerBar.addColorStop(0.7, "#94A3B8");
      headerBar.addColorStop(1, "#FFFFFF");
      ctx.fillStyle = headerBar;
      ctx.fillRect(60, 60, cvs.width - 120, 4);

      // Header Branding
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 52px 'Be Vietnam Pro', sans-serif";
      ctx.fillText("HYPETICKET", 75, 145);

      // EDITION '26 Secondary Display
      ctx.fillStyle = "#CBD5E1";
      ctx.font = "800 24px 'IBM Plex Mono', monospace";
      ctx.fillText("EDITION '26", 450, 142);

      // Pass Badge (Dark Titanium Backing)
      ctx.fillStyle = "#14141E";
      ctx.fillRect(680, 95, 260, 48);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(680, 95, 260, 48);

      ctx.fillStyle = "#FF176B";
      ctx.font = "800 18px 'IBM Plex Mono', monospace";
      ctx.fillText("★", 705, 126);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 18px 'IBM Plex Mono', monospace";
      ctx.fillText("VIP COLLECTIBLE", 730, 126);

      // Main Event Info Panel
      ctx.fillStyle = "rgba(14, 14, 20, 0.85)";
      ctx.fillRect(75, 180, 920, 360);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(75, 180, 920, 360);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 46px 'Be Vietnam Pro', sans-serif";
      const maxWidth = 860;
      const words = heroEventTitle.split(" ");
      let line = "";
      let y = 265;
      let lineCount = 0;

      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + " ";
        if (ctx.measureText(test).width > maxWidth && i > 0) {
          ctx.fillText(line.trim(), 110, y);
          line = words[i] + " ";
          y += 58;
          lineCount++;
          if (lineCount >= 2) {
            line = line + "...";
            break;
          }
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), 110, y);

      // Tier & Coordinates
      ctx.fillStyle = "#FF176B";
      ctx.font = "800 24px 'IBM Plex Mono', monospace";
      ctx.fillText("ALL-ACCESS VIP PASS // ZONE A", 110, lineCount > 0 ? y + 54 : 355);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("COORD: 10.8231° N, 106.6297° E • SECURITY #99420", 110, lineCount > 0 ? y + 100 : 410);

      // Barcode
      ctx.fillStyle = "#FFFFFF";
      const barX = 75;
      for (let i = 0; i < 90; i++) {
        const w = (i % 5 === 0 ? 6 : i % 2 === 0 ? 3 : 1.5);
        ctx.fillRect(barX + i * 10, 600, w, 85);
      }

      ctx.fillStyle = "#CBD5E1";
      ctx.font = "600 20px 'IBM Plex Mono', monospace";
      ctx.fillText("TOKEN: 0x99420 • RFID AUTHENTICATED", 75, 735);

      // Perforation Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 2;
      ctx.setLineDash([16, 14]);
      ctx.beginPath();
      ctx.moveTo(1050, 45);
      ctx.lineTo(1050, cvs.height - 45);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#050508";
      ctx.beginPath();
      ctx.arc(1050, 30, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(1050, cvs.height - 30, 24, 0, Math.PI * 2);
      ctx.fill();

      // Stub QR Header
      ctx.fillStyle = "#CBD5E1";
      ctx.font = "900 28px 'Be Vietnam Pro', sans-serif";
      ctx.fillText("ADMIT ONE", 1120, 140);

      // High-Contrast QR Code
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(1120, 180, 380, 380);

      ctx.fillStyle = "#050508";
      ctx.fillRect(1145, 205, 95, 95);
      ctx.fillRect(1380, 205, 95, 95);
      ctx.fillRect(1145, 440, 95, 95);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(1160, 220, 65, 65);
      ctx.fillRect(1395, 220, 65, 65);
      ctx.fillRect(1160, 455, 65, 65);
      ctx.fillStyle = "#050508";
      ctx.fillRect(1180, 240, 25, 25);
      ctx.fillRect(1415, 240, 25, 25);
      ctx.fillRect(1180, 475, 25, 25);

      for (let rx = 0; rx < 12; rx++) {
        for (let ry = 0; ry < 12; ry++) {
          if ((rx * 7 + ry * 13) % 3 === 0 || (rx * ry) % 5 === 0) {
            ctx.fillRect(1265 + (rx % 6) * 18, 220 + ry * 24, 13, 13);
          }
        }
      }

      ctx.fillStyle = "#FF176B";
      ctx.font = "800 22px monospace";
      ctx.fillText("SEC-2026-ENCRYPTED", 1160, 620);

      return cvs;
    };

    const initialCanvas = createPassCanvas();
    const passTexture = initialCanvas ? new THREE.CanvasTexture(initialCanvas) : null;
    if (passTexture) {
      passTexture.colorSpace = THREE.SRGBColorSpace;
      passTexture.generateMipmaps = true;
      passTexture.minFilter = THREE.LinearMipmapLinearFilter;
    }

    // Font readiness listener (Ensures fonts are never rendered with fallback on slow load)
    if (document.fonts) {
      document.fonts.ready.then(() => {
        const updatedCanvas = createPassCanvas();
        if (updatedCanvas && passTexture) {
          passTexture.image = updatedCanvas;
          passTexture.needsUpdate = true;
        }
      });
    }

    // 6. Geometry & Multi-Material Construction (Glossy Satin Titanium Finish)
    const ticketGeometry = new THREE.BoxGeometry(3.6, 1.8, 0.06);

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1A24,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x08080C,
    });

    const backMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0E0E14,
      metalness: 0.9,
      roughness: 0.25,
      clearcoat: 0.5,
    });

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: passTexture,
      roughness: 0.22,
      metalness: 0.75,
      clearcoat: 0.6,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });

    const materials = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ];

    const passMesh = new THREE.Mesh(ticketGeometry, materials);
    
    const getBasePosition = (aspect: number) => {
      if (aspect > 1.6) return { x: 2.15, y: 0.05, scale: 0.68 };
      if (aspect > 1.3) return { x: 1.8, y: 0.05, scale: 0.62 };
      if (aspect > 1.0) return { x: 1.4, y: 0.05, scale: 0.55 };
      return { x: 0, y: -0.65, scale: 0.52 };
    };

    const initialPos = getBasePosition(camera.aspect);
    passMesh.position.set(initialPos.x, initialPos.y, 0);
    passMesh.scale.set(initialPos.scale, initialPos.scale, initialPos.scale);

    const baseRotY = THREE.MathUtils.degToRad(-16);
    const baseRotX = THREE.MathUtils.degToRad(8);
    const baseRotZ = THREE.MathUtils.degToRad(-2);

    passMesh.rotation.y = baseRotY;
    passMesh.rotation.x = baseRotX;
    passMesh.rotation.z = baseRotZ;
    scene.add(passMesh);

    // 7. Minimal Subtle Space Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 14;
      particlePos[i + 1] = (Math.random() - 0.5) * 9;
      particlePos[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Interactive Mouse, Touch & Scroll Dynamics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = window.scrollY;
    let isVisible = true;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "100px" }
    );
    intersectionObserver.observe(container);

    // 9. High-Performance 60FPS Render Loop with Cinematic Entrance
    let animationFrameId: number;
    let hasRenderedFirstFrame = false;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const currentBase = getBasePosition(camera.aspect);
      const scrollFactor = Math.min(scrollY / 1200, 1.5);

      const introProgress = Math.min(elapsedTime / 1.4, 1.0);
      const easeOutExpo = 1 - Math.pow(2, -10 * introProgress);

      const targetScale = currentBase.scale;
      const currentScale = THREE.MathUtils.lerp(targetScale * 0.25, targetScale, easeOutExpo);
      passMesh.scale.set(currentScale, currentScale, currentScale);

      const introZ = THREE.MathUtils.lerp(-4.5, 0, easeOutExpo);
      const introRotY = THREE.MathUtils.lerp(THREE.MathUtils.degToRad(-60), baseRotY, easeOutExpo);
      const introRotX = THREE.MathUtils.lerp(THREE.MathUtils.degToRad(30), baseRotX, easeOutExpo);

      passMesh.position.y = currentBase.y + Math.sin(elapsedTime * 1.2) * 0.08 - scrollFactor * 0.5;
      passMesh.position.x = currentBase.x + mouse.x * 0.15;
      passMesh.position.z = introZ + Math.sin(elapsedTime * 0.7) * 0.08 + scrollFactor * 0.2;

      if (introProgress < 1.0) {
        passMesh.rotation.y = introRotY + mouse.x * 0.25;
        passMesh.rotation.x = introRotX + mouse.y * 0.16;
        passMesh.rotation.z = baseRotZ - mouse.x * 0.03;
      } else {
        passMesh.rotation.y = baseRotY + mouse.x * 0.25 + Math.cos(elapsedTime * 0.5) * 0.03 - scrollFactor * 0.2;
        passMesh.rotation.x = baseRotX + mouse.y * 0.16 + Math.sin(elapsedTime * 0.6) * 0.02;
        passMesh.rotation.z = baseRotZ - mouse.x * 0.03;
      }

      const introGlint = introProgress < 1.0 ? Math.sin(introProgress * Math.PI) * 2.0 : 0;
      keyLight.position.x = 3.5 + mouse.x * 2.5 + introGlint;
      keyLight.position.y = 2.5 + mouse.y * 2.5;
      whiteRimLight.position.x = -3.5 + mouse.x;
      whiteRimLight.position.y = -2.5 + mouse.y;

      particles.rotation.y = elapsedTime * 0.015 + scrollFactor * 0.15;

      renderer.render(scene, camera);

      if (!hasRenderedFirstFrame) {
        hasRenderedFirstFrame = true;
        setIsLoaded(true);
      }
    };

    animate();

    // 10. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const newBase = getBasePosition(camera.aspect);
      passMesh.scale.set(newBase.scale, newBase.scale, newBase.scale);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 11. Cleanup
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      ticketGeometry.dispose();
      passTexture?.dispose();
      edgeMaterial.dispose();
      backMaterial.dispose();
      frontMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [heroEventTitle]);

  return (
    <div className={`relative w-full h-full transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}>
      <div ref={containerRef} className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing" />
    </div>
  );
};
