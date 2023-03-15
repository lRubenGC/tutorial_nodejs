const { response } = require('express');

const { subirArchivo } = require('../helpers');

const cargarArchivo = async (req, res = response) => {  
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).json({msg: 'No hay archivos que subir'});
      return;
    }  
  
    
    try {
        // txt, md
        // const nombreArchivo = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre: nombreArchivo
        })
    } catch ( err ) {
        return res.status(400).json({msg: err})
    }

}

module.exports = {
    cargarArchivo
};