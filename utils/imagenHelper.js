
const imagenASrc = (img) => {
    const obj = img.toJSON ? img.toJSON() : { ...img };
    if (obj.datos) {
        const buf = Buffer.isBuffer(obj.datos) ? obj.datos : Buffer.from(obj.datos);
        const mime = obj.foto && obj.foto.includes('/') ? obj.foto : 'image/jpeg';
        obj.foto = `data:${mime};base64,${buf.toString('base64')}`;
    }
    return obj;
};

const imagenesASrc = (imagenes) => imagenes.map(imagenASrc);

module.exports = { imagenASrc, imagenesASrc };