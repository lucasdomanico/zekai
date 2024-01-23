import { path as create_path } from './path.z.js';
export let three = await import('./three/three.module.js');
export let line2 = (await import('./three/jsm/lines/Line2.js')).Line2;
export let lineMaterial = (await import('./three/jsm/lines/LineMaterial.js')).LineMaterial;
export let lineGeometry = (await import('./three/jsm/lines/LineGeometry.js')).LineGeometry;
export const record = (v) => {
    return Object.fromEntries(v);
};
export let line_mesh_width = 0.02;
export const vertices_to_mesh = (vertices, color, lineWidth) => {
    let geometry = new lineGeometry();
    geometry.setPositions(vertices);
    let matLine = new lineMaterial(record([['color', color], ['linewidth', lineWidth], ['worldUnits', true]]));
    let line = new line2(geometry, matLine);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    return line;
};
export const line_to_mesh = (x, y, z, x2, y2, z2, color) => {
    let vertices = new Float32Array([x, y, z, x2, y2, z2]);
    return vertices_to_mesh(vertices, color, line_mesh_width);
};
export const translate_axis = (x, y, z, axis_x, axis_y, axis_z, distance) => {
    let o = new three.Object3D();
    o.position.x = x;
    o.position.y = y;
    o.position.z = z;
    o.updateMatrix();
    let axis = new three.Vector3(axis_x, axis_y, axis_z);
    o.translateOnAxis(axis, distance);
    o.updateMatrix();
    return [o.position.x, o.position.y, o.position.z];
};
export const camera_displacement = (camera, camera_displacement, path, curve) => {
    camera_displacement *= 10;
    let n = Math.floor(camera_displacement);
    let t = camera_displacement % 1;
    let line = path.lines[n];
    let next = path.lines[n + 1];
    if (next === undefined) {
        location.reload();
        return;
    }
    let point = curve.getPoint(camera_displacement / path.lines.length);
    let tan = curve.getTangent(camera_displacement / path.lines.length);
    let normal = new three.Vector3(line.nx, line.ny, line.nz).lerp(new three.Vector3(next.nx, next.ny, next.nz), t);
    let q = translate_axis(point.x, point.y, point.z, normal.x, normal.y, normal.z, 1);
    camera.position.x = q[0];
    camera.position.y = q[1];
    camera.position.z = q[2];
    camera.up = new three.Vector3(normal.x, normal.y, normal.z);
    camera.lookAt(point.x + tan.x * 2, point.y + tan.y * 2, point.z + tan.z * 2);
    let p = translate_axis(camera.position.x, camera.position.y, camera.position.z, tan.x, tan.y, tan.z, -4);
    camera.position.x = p[0];
    camera.position.y = p[1];
    camera.position.z = p[2];
    let w = translate_axis(camera.position.x, camera.position.y, camera.position.z, normal.x, normal.y, normal.z, 2);
    camera.position.x = w[0];
    camera.position.y = w[1];
    return camera.position.z = w[2];
};
export let colors_sides = 0x0000FF;
export let colors_center = 0x0000FF;
export let colors_middle = 0xFF0000;
export let colors_backg = 0xFFCC00;
export const tick = (canvas, resolution_width, resolution_height) => {
    let renderer = new three.WebGLRenderer(record([['canvas', canvas], ['antialias', true], ['alpha', true]]));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(resolution_width, resolution_height);
    renderer.setViewport(0, 0, resolution_width, resolution_height);
    let scene = new three.Scene();
    let camera = new three.PerspectiveCamera(40, resolution_width / resolution_height, 0.01, 10000);
    camera.position.set(0, 0, 5);
    let floor = new three.TextureLoader().load('assets/floor.png');
    let path = create_path(Math.random());
    path.lines.forEach((line, i) => {
        let mesh = line_to_mesh(line.x, line.y, line.z, line.x2, line.y2, line.z2, colors_center);
        scene.add(mesh);
        if (i !== 0) {
            let next = path.lines[i - 1];
            let l = line_to_mesh(line.x, line.y, line.z, next.x, next.y, next.z, colors_sides);
            scene.add(l);
            let r = line_to_mesh(line.x2, line.y2, line.z2, next.x2, next.y2, next.z2, colors_sides);
            scene.add(r);
        }
    });
    let loader = new three.CubeTextureLoader();
    loader.setPath('assets/skybox/');
    let cubetex = loader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
    scene.background = new three.Color(colors_backg);
    canvas.onclick = () => {
        return location.reload();
    };
    let curve = new three.CatmullRomCurve3(path.lines.map((line) => {
        return new three.Vector3(line.cx, line.cy, line.cz);
    }));
    let camera_displace = 0;
    let time = Date.now();
    return renderer.setAnimationLoop(() => {
        let delta = (Date.now() - time) / 1000;
        time = Date.now();
        camera_displace += delta;
        camera_displacement(camera, camera_displace, path, curve);
        return renderer.render(scene, camera);
    });
};
export const main = () => {
    return console.log(line2);
};
