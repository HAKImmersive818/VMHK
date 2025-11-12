# 3D Models Directory

## 📁 Upload Your GLB Model Here

Place your `.glb` or `.gltf` 3D model files in this directory.

### Recommended File Names:
- `doctor.glb` - Main doctor avatar model
- `avatar.glb` - Alternative avatar
- `medical-scene.glb` - Medical environment

### Usage in Code:
```jsx
// In DoctorAvatar.jsx or any React component
import { useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/models/doctor.glb');
  return <primitive object={scene} />;
}
```

### File Requirements:
- Format: `.glb` (preferred) or `.gltf`
- Size: Keep under 10MB for fast loading
- Optimization: Use tools like gltf-pipeline to compress

### Current Models:
- Upload your GLB model here and I'll integrate it into the DoctorAvatar component!
