# 🗺️ ROADMAP DE INNOVACIÓN Y POSICIONAMIENTO WEB — DOORMASTER

Este documento sirve como la **bitácora de control de calidad, desarrollo y SEO** para transformar la presencia digital de Doormaster en una experiencia interactiva de nivel internacional (Awwwards / Apple), diseñada para capturar clientes de alto valor y posicionarse de forma orgánica y autónoma en Bogotá.

---

## 🚀 ESTADO ACTUAL DEL PROYECTO
*   **Diseño:** Premium Dark Mode unificado (Glassmorphism de alta gama).
*   **Conversión:** Botón flotante magnético interactivo y CTAs inteligentes.
*   **Rendimiento:** Optimizado masivamente con conversión WebP (ahorro de más de 125 MB de peso).
*   **Animación:** Motor Split-Words (revelación suave palabra por palabra) y física 3D en tarjetas.

---

## 📅 PLAN DE ACCIÓN Y SEGUIMIENTO DE FASES

### 🟢 FASE 1: Rendimiento Extremo & SEO Técnico Base (95% Completado)
> El rendimiento es el pilar número 1 del SEO de Google. Una web lenta nunca se posicionará en los primeros lugares.
- [x] **Compresión y Conversión WebP:** Reducción del tamaño del sitio de >130MB a ~3MB convirtiendo todas las imágenes y optimizando videos.
- [x] **Unificación de Enlaces:** Reparación de enlaces y botones de contacto rotos (`#` a flujos reales de WhatsApp).
- [x] **SEO Local Bogotá:** Metatítulos descriptivos y meta-descripciones enriquecidas con palabras clave clave para Bogotá.
- [x] **Esquemas Estructurados (Schema.org):** Inyección de JSON-LD LocalBusiness para que Google indexe los teléfonos, servicios y dirección física de Doormaster directamente en los resultados de búsqueda.
- [x] **Open Graph (OG) Tags:** Optimización para compartidos en redes sociales (WhatsApp, Facebook, Instagram) mostrando imagen corporativa premium.
- [ ] **Purga de CSS Inactivo:** Remover estilos CSS no utilizados con PurgeCSS para reducir al mínimo el tiempo de descarga (Falta por correr en build final).

---

### 🟢 FASE 2: Scroll Líquido e Inercia Táctil (100% Completado)
> Cambiar la "textura" física de la navegación para que se sienta premium, imitando la física de desplazamiento suave de las mejores apps del mundo.
- [x] **Integración de Lenis Smooth Scroll:** Incluir el motor ultra-liviano de scroll por inercia física.
- [x] **Amortiguación Física:** Configurar los coeficientes de aceleración y desaceleración para que el scroll fluya como la seda.
- [x] **Compatibilidad Táctil:** Asegurar que el deslizamiento inercial sea perfecto en dispositivos iOS y Android.

---

### 🟢 FASE 3: GSAP + ScrollTrigger (100% Completado)
> Pasar de revelaciones estáticas a animaciones líquidas enlazadas directamente a la rueda del mouse del usuario.
- [x] **Importación de GSAP (GreenSock):** Cargar la plataforma de animación estándar de oro en la industria.
- [x] **ScrollTrigger Timelines:** Configurar que las imágenes y textos se muevan a diferentes velocidades de forma asimétrica (Parallax Real de profundidad).
- [x] **Revelaciones de Grilla Premium:** Reemplazo de staggers básicos por staggers de GSAP que fluidifican la entrada.
- [x] **Máscaras de Clip-Path Dinámicas:** Los títulos de sección emergen con cortinas fluidas basadas en scroll.

---

### 🟢 FASE 4: Layout Asimétrico de Vanguardia & Orbes Interactivos (100% Completado)
> Romper la estructura tradicional de plantillas sencillas para lucir como un estudio de diseño exclusivo.
- [x] **Tipografía Monumental & Outline:** Soporte técnico implementado mediante estilos de trazo outline (`.outline-text`) para titulares modernos.
- [x] **Orbes de Luz Ambientales Dinámicos:** Inyección por JavaScript de dos círculos difuminados de alta tecnología con movimiento inercial 3D basado en mousemove (atados a GSAP).
- [x] **Bordes de Cristal Iluminados (Glassmorphism Pro):** Redefinición de tarjetas con fondos semi-translúcidos hiper-densos, saturación de color, bordes con brillos de luz de cristal y reflejos en hover.

---

### 🟢 FASE 5: Experiencia de Aplicación Nativa (100% Completado)
> Eliminar el parpadeo blanco del navegador para lograr una navegación completamente mágica.
- [x] **Zero-Reload Navigation Illusion:** Implementación de interceptor de navegación local por JavaScript que previene el salto brusco clásico y sincroniza las cargas con GSAP.
- [x] **Cortina Digital Doormaster:** Creación de cortina digital con logotipo animado y barra de carga síncrona que barre la pantalla a 60fps ocultando la carga física del HTML.
- [x] **Contextual Locksmith Scene (Premium):** Escena animada personalizada con vectores SVG donde una llave física de alta tecnología entra y gira dinámicamente en el cerrojo para desbloquear la entrada de la sección de Cerrajería.

---

## 🎯 MÉTRICAS Y SEO: "Posicionamiento Autónomo"
Para lograr que la web se posicione "sola", seguiremos estrictamente estas reglas en la fase final:

1.  **LCP (Largest Contentful Paint) < 1.2s:** El elemento más pesado de la pantalla inicial se renderizará en menos de 1.2 segundos mediante pre-cargas optimizadas.
2.  **Métricas CLS (Cumulative Layout Shift) = 0:** Cero saltos molestos de diseño al cargar la página; reservamos el espacio exacto de las imágenes y videos antes de cargarse.
3.  **SEO Semántico Riguroso:** Una sola etiqueta `<h1>` por página, jerarquía impecable de `<h2>` y `<h3>`, y atributos `alt` minuciosos en cada imagen usando palabras clave geolocalizadas (ej. `alt="Puerta automática de vidrio instalada en edificio corporativo en el norte de Bogotá"`).
