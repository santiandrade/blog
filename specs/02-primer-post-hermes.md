# Spec 02 — Primer post: agente de IA con Hermes

**Estado:** Implementado
**Dependencias:** Spec 01
**Fecha:** 2026-07-31

## Objetivo

Publicar el primer artículo real del blog, dirigido a lectores no técnicos que estén empezando a interesarse por la IA. El post explica en primera persona por qué Santi creó TARS sobre Hermes, qué diferencia un agente de un chatbot, los principales desafíos y los casos de uso reales.

## Decisión de contenido

El proyecto sigue siendo una SPA estática sin generador, CMS ni modelo de contenido. Para el primer post se mantiene la arquitectura existente:

- la tarjeta se incorpora directamente al listado de `home`;
- la plantilla placeholder de la pantalla `post` se convierte en el artículo real;
- la navegación continúa usando `data-route="home|post|about"`;
- el contenido se publica en español e inglés mediante `data-l="es|en"`;
- el buscador existente filtra la tarjeta mediante `data-terms`.

Esta es la opción de menor complejidad y preserva el diseño aprobado. Cuando exista más de un artículo habrá que introducir identificadores de post y decidir entre rutas/archivos independientes o una pequeña capa de datos; duplicar pantallas completas en el HTML no escala bien.

## Alcance

- Añadir una tarjeta real a la portada y actualizar el contador a un post.
- Sustituir el contenido placeholder por el artículo bilingüe.
- Cubrir motivación, explicación accesible de los agentes, elección de Hermes, límites y confianza, memoria, casos de uso y aprendizajes.
- Enlazar la documentación oficial de Hermes.
- Añadir estilos para la tarjeta, listas y navegación final del primer post.
- Mantener tema claro/oscuro, responsive, buscador y rutas relativas.

## Criterios de aceptación

- [x] La portada muestra un único post y permite abrirlo.
- [x] Buscar términos como `Hermes`, `agente` o `memory` conserva la tarjeta; una búsqueda sin coincidencias muestra el estado vacío.
- [x] El artículo puede leerse completo en español e inglés.
- [x] El tono es introductorio y evita convertir el post en un tutorial de instalación.
- [x] Las capacidades atribuidas a Hermes están contrastadas con la documentación oficial.
- [x] Los casos de uso personales mencionados corresponden a integraciones o flujos reales, sin publicar secretos ni detalles sensibles.
- [x] El contenido mantiene el layout responsive y los dos temas del sitio.
