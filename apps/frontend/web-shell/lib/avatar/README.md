# Sistema de avatares 3D

Editor de avatares humanos 3D para PCCL. Ruta: `/identity/avatar`.

## Estado real

| Parte | Estado |
|---|---|
| Modelos humanos `.blend` fuente | Hecho en `assets/avatar-source/blender/` |
| Modelos humanos `.glb` web | Hecho en `public/avatars/custom/bodies/` |
| Rig humano, skin, morphs y clips | Validado por scripts Blender y glTF |
| Integración `/identity/avatar` | Validada con smoke test cargando GLB local en canvas |
| Ready Player Me | Conservado como alternativa remota |

Los modelos custom son procedurales, estilizados y locales. No dependen de red
ni de Ready Player Me para que el editor funcione.

## Arquitectura

```
lib/avatar/
├── custom.ts         Catálogo custom, paths seguros y mapas de rig/morphs
├── types.ts          Modelo de datos + AVATAR_SCHEMA_VERSION
├── catalog.ts        Expresiones, poses y fondos
├── serialization.ts  Validación, migración y saneado
├── provider.ts       Resolver de modelo custom/RPM
├── store.ts          Zustand + deshacer/rehacer + persistencia
└── __tests__/        Pruebas de serialización, catálogo y store
```

```
tools/blender/
├── build_avatar.py      Genera `.blend`, `.glb`, miniatura y reporte
├── validate_scene.py    Valida rig, morphs, animaciones y presupuesto
└── export_glb.py        Exporta una escena Blender a GLB

tools/avatar-pipeline/
├── build.mjs            Genera `manifest.json`
├── inspect.mjs          Inspecciona GLB con glTF-Transform
├── optimize.mjs         Produce reporte/copia optimizada
├── validate.mjs         Valida manifiesto y GLB inspeccionados
└── smoke-identity-avatar.mjs  Abre `/identity/avatar` y confirma canvas + GLB
```

## Comandos

```bash
pnpm --filter frontend avatar:build
pnpm --filter frontend avatar:inspect
pnpm --filter frontend avatar:optimize
pnpm --filter frontend avatar:validate
pnpm --filter frontend avatar:smoke
pnpm --filter frontend test
pnpm --filter frontend lint
pnpm --filter frontend build
```

## Decisiones

- Se guarda configuración, no GLB por usuario.
- `custom` es el provider por defecto y `readyplayerme` queda como alternativa.
- Las rutas custom solo aceptan `/avatars/custom/**/*.glb` sin traversal.
- El GLB se clona con `SkeletonUtils` para no compartir skeleton entre instancias.
- Los clips `Idle`, `Breathing`, `Wave` y `Presentation` se seleccionan por pose.
