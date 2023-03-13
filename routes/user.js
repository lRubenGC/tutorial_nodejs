const { Router } = require("express");
const { check } = require("express-validator");

const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user");

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require("../middlewares");
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", userGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("nombre", "Nombre no válido").optional().not().isEmpty(),
    check("mail", "El correo no es válido").optional().isEmail(),
    check("mail").custom(emailExiste),
    check("password", "El password debe de ser de más de 6 letras")
      .optional()
      .isLength({ min: 6 }),
    check("rol").optional().custom(esRoleValido),
    validarCampos,
  ],
  userPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("mail", "El correo no es válido").isEmail(),
    check("mail").custom(emailExiste),
    check("password", "El password debe de ser de más de 6 letras").isLength({
      min: 6,
    }),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  userPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  userDelete
);

module.exports = router;
