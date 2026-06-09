SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    sexo character(1),
    fecha_nacimiento date,
    correo character varying(150) NOT NULL,
    contrasena character varying(255) NOT NULL,
    bio text,
    avatar character varying(255),
    estado character varying(20) DEFAULT 'activo'::character varying,
    es_moderador boolean DEFAULT false,
    fecha_creacion timestamp with time zone,
    fecha_baja timestamp with time zone,
    CONSTRAINT usuario_estado_check CHECK (((estado)::text = ANY (ARRAY['activo'::text, 'inactivo'::text, 'suspendido'::text]))),
    CONSTRAINT usuario_sexo_check CHECK ((sexo = ANY (ARRAY['M'::bpchar, 'F'::bpchar, 'O'::bpchar])))
);

CREATE SEQUENCE public.usuario_id_usuario_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;
ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);

CREATE TABLE public.publicacion (
    id_publicacion integer NOT NULL,
    titulo character varying(200) NOT NULL,
    descripcion text,
    fecha_publicacion timestamp with time zone,
    estado character varying(20) DEFAULT 'activo'::character varying,
    id_creador integer NOT NULL,
    CONSTRAINT publicacion_estado_check CHECK (((estado)::text = ANY (ARRAY['activo'::text, 'inactivo'::text, 'bajada'::text])))
);

CREATE SEQUENCE public.publicacion_id_publicacion_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.publicacion_id_publicacion_seq OWNED BY public.publicacion.id_publicacion;
ALTER TABLE ONLY public.publicacion ALTER COLUMN id_publicacion SET DEFAULT nextval('public.publicacion_id_publicacion_seq'::regclass);

CREATE TABLE public.etiqueta (
    id_etiqueta integer NOT NULL,
    nombre_etiqueta character varying(50) NOT NULL
);

CREATE SEQUENCE public.etiqueta_id_etiqueta_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.etiqueta_id_etiqueta_seq OWNED BY public.etiqueta.id_etiqueta;
ALTER TABLE ONLY public.etiqueta ALTER COLUMN id_etiqueta SET DEFAULT nextval('public.etiqueta_id_etiqueta_seq'::regclass);

CREATE TABLE public.publicacion_etiqueta (
    id_publicacion integer NOT NULL,
    id_etiqueta integer NOT NULL
);

CREATE TABLE public.imagen (
    id_imagen integer NOT NULL,
    foto character varying(255) NOT NULL,
    ancho integer,
    altura integer,
    licencia character varying(20) DEFAULT 'sin_copyright'::character varying,
    marca_de_agua boolean DEFAULT false,
    texto_marca character varying(200),
    fecha_subida timestamp with time zone,
    estado character varying(20) DEFAULT 'activo'::character varying,
    comentario_clausurado boolean DEFAULT false,
    id_publicacion integer NOT NULL,
    CONSTRAINT imagen_estado_check CHECK (((estado)::text = ANY (ARRAY['activo'::text, 'inactivo'::text, 'bajada'::text]))),
    CONSTRAINT imagen_licencia_check CHECK (((licencia)::text = ANY (ARRAY['copyright'::text, 'sin_copyright'::text])))
);

CREATE SEQUENCE public.imagen_id_imagen_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.imagen_id_imagen_seq OWNED BY public.imagen.id_imagen;
ALTER TABLE ONLY public.imagen ALTER COLUMN id_imagen SET DEFAULT nextval('public.imagen_id_imagen_seq'::regclass);

CREATE TABLE public.voto (
    id_voto integer NOT NULL,
    valoracion integer NOT NULL,
    fecha_voto timestamp with time zone,
    id_votante integer NOT NULL,
    id_imagen integer NOT NULL,
    CONSTRAINT voto_valoracion_check CHECK (((valoracion >= 1) AND (valoracion <= 5)))
);

CREATE SEQUENCE public.voto_id_voto_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.voto_id_voto_seq OWNED BY public.voto.id_voto;
ALTER TABLE ONLY public.voto ALTER COLUMN id_voto SET DEFAULT nextval('public.voto_id_voto_seq'::regclass);

CREATE TABLE public.comentario (
    id_comentario integer NOT NULL,
    texto text NOT NULL,
    fecha_comentario timestamp with time zone,
    estado character varying(20) DEFAULT 'activo'::character varying,
    id_comentador integer NOT NULL,
    id_imagen integer NOT NULL,
    CONSTRAINT comentario_estado_check CHECK (((estado)::text = ANY (ARRAY['activo'::text, 'eliminado'::text])))
);

CREATE SEQUENCE public.comentario_id_comentario_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.comentario_id_comentario_seq OWNED BY public.comentario.id_comentario;
ALTER TABLE ONLY public.comentario ALTER COLUMN id_comentario SET DEFAULT nextval('public.comentario_id_comentario_seq'::regclass);

CREATE TABLE public.usuario_seguidor (
    id_seguimiento integer NOT NULL,
    id_usuario integer NOT NULL,
    id_seguidor integer NOT NULL,
    fecha_seguimiento timestamp with time zone,
    CONSTRAINT usuario_seguidor_check CHECK ((id_usuario <> id_seguidor))
);

CREATE SEQUENCE public.usuario_seguidor_id_seguimiento_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.usuario_seguidor_id_seguimiento_seq OWNED BY public.usuario_seguidor.id_seguimiento;
ALTER TABLE ONLY public.usuario_seguidor ALTER COLUMN id_seguimiento SET DEFAULT nextval('public.usuario_seguidor_id_seguimiento_seq'::regclass);

CREATE TABLE public.denuncia (
    id_denuncia integer NOT NULL,
    motivo character varying(100) NOT NULL,
    descripcion text,
    fecha_denuncia timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    id_denunciante integer NOT NULL,
    id_imagen integer,
    id_comentario integer,
    CONSTRAINT denuncia_check CHECK ((((id_imagen IS NOT NULL) AND (id_comentario IS NULL)) OR ((id_imagen IS NULL) AND (id_comentario IS NOT NULL)))),
    CONSTRAINT denuncia_estado_check CHECK (((estado)::text = ANY (ARRAY['pendiente'::text, 'desestimada'::text, 'aceptada'::text])))
);

CREATE SEQUENCE public.denuncia_id_denuncia_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.denuncia_id_denuncia_seq OWNED BY public.denuncia.id_denuncia;
ALTER TABLE ONLY public.denuncia ALTER COLUMN id_denuncia SET DEFAULT nextval('public.denuncia_id_denuncia_seq'::regclass);

CREATE TABLE public.coleccion (
    id_coleccion integer NOT NULL,
    titulo character varying(100) NOT NULL,
    fecha_coleccion timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    id_creador integer NOT NULL,
    CONSTRAINT coleccion_estado_check CHECK (((estado)::text = ANY (ARRAY['activo'::text, 'inactivo'::text])))
);

CREATE SEQUENCE public.coleccion_id_coleccion_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.coleccion_id_coleccion_seq OWNED BY public.coleccion.id_coleccion;
ALTER TABLE ONLY public.coleccion ALTER COLUMN id_coleccion SET DEFAULT nextval('public.coleccion_id_coleccion_seq'::regclass);

CREATE TABLE public.coleccion_imagen (
    id_coleccion integer NOT NULL,
    id_imagen integer NOT NULL
);

CREATE TABLE public.interes (
    id_interes integer NOT NULL,
    id_interesado integer NOT NULL,
    id_imagen integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.interes_id_interes_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.interes_id_interes_seq OWNED BY public.interes.id_interes;
ALTER TABLE ONLY public.interes ALTER COLUMN id_interes SET DEFAULT nextval('public.interes_id_interes_seq'::regclass);

CREATE TABLE public.mensaje (
    id_mensaje integer NOT NULL,
    texto text NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_emisor integer NOT NULL,
    id_receptor integer NOT NULL,
    id_interes integer NOT NULL
);

CREATE SEQUENCE public.mensaje_id_mensaje_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.mensaje_id_mensaje_seq OWNED BY public.mensaje.id_mensaje;
ALTER TABLE ONLY public.mensaje ALTER COLUMN id_mensaje SET DEFAULT nextval('public.mensaje_id_mensaje_seq'::regclass);

CREATE TABLE public.notificacion (
    id_notificacion integer NOT NULL,
    tipo_notificacion character varying(50) NOT NULL,
    descripcion text,
    fecha_notificacion timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'no_leida'::character varying NOT NULL,
    id_receptor integer NOT NULL,
    id_voto integer,
    id_seguimiento integer,
    id_comentario integer,
    id_denuncia integer,
    id_interes integer,
    CONSTRAINT notificacion_estado_check CHECK (((estado)::text = ANY (ARRAY['leida'::text, 'no_leida'::text]))),
    CONSTRAINT notificacion_tipo_notificacion_check CHECK (((tipo_notificacion)::text = ANY (ARRAY['comentario'::text, 'valoracion'::text, 'me_interesa'::text, 'nuevo_seguidor'::text])))
);

CREATE SEQUENCE public.notificacion_id_notificacion_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNED BY public.notificacion.id_notificacion;
ALTER TABLE ONLY public.notificacion ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificacion_id_notificacion_seq'::regclass);

-- PRIMARY KEYS
ALTER TABLE ONLY public.usuario ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);
ALTER TABLE ONLY public.publicacion ADD CONSTRAINT publicacion_pkey PRIMARY KEY (id_publicacion);
ALTER TABLE ONLY public.etiqueta ADD CONSTRAINT etiqueta_pkey PRIMARY KEY (id_etiqueta);
ALTER TABLE ONLY public.etiqueta ADD CONSTRAINT etiqueta_nombre_etiqueta_key UNIQUE (nombre_etiqueta);
ALTER TABLE ONLY public.publicacion_etiqueta ADD CONSTRAINT publicacion_etiqueta_pkey PRIMARY KEY (id_publicacion, id_etiqueta);
ALTER TABLE ONLY public.imagen ADD CONSTRAINT imagen_pkey PRIMARY KEY (id_imagen);
ALTER TABLE ONLY public.voto ADD CONSTRAINT voto_pkey PRIMARY KEY (id_voto);
ALTER TABLE ONLY public.voto ADD CONSTRAINT voto_id_votante_id_imagen_key UNIQUE (id_votante, id_imagen);
ALTER TABLE ONLY public.comentario ADD CONSTRAINT comentario_pkey PRIMARY KEY (id_comentario);
ALTER TABLE ONLY public.usuario_seguidor ADD CONSTRAINT usuario_seguidor_pkey PRIMARY KEY (id_seguimiento);
ALTER TABLE ONLY public.usuario_seguidor ADD CONSTRAINT usuario_seguidor_id_usuario_id_seguidor_key UNIQUE (id_usuario, id_seguidor);
ALTER TABLE ONLY public.denuncia ADD CONSTRAINT denuncia_pkey PRIMARY KEY (id_denuncia);
ALTER TABLE ONLY public.coleccion ADD CONSTRAINT coleccion_pkey PRIMARY KEY (id_coleccion);
ALTER TABLE ONLY public.coleccion_imagen ADD CONSTRAINT coleccion_imagen_pkey PRIMARY KEY (id_coleccion, id_imagen);
ALTER TABLE ONLY public.interes ADD CONSTRAINT interes_pkey PRIMARY KEY (id_interes);
ALTER TABLE ONLY public.interes ADD CONSTRAINT interes_id_interesado_id_imagen_key UNIQUE (id_interesado, id_imagen);
ALTER TABLE ONLY public.mensaje ADD CONSTRAINT mensaje_pkey PRIMARY KEY (id_mensaje);
ALTER TABLE ONLY public.notificacion ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id_notificacion);
ALTER TABLE ONLY public.usuario ADD CONSTRAINT usuario_correo_key UNIQUE (correo);

-- FOREIGN KEYS
ALTER TABLE ONLY public.publicacion ADD CONSTRAINT publicacion_id_creador_fkey FOREIGN KEY (id_creador) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE;
ALTER TABLE ONLY public.publicacion_etiqueta ADD CONSTRAINT publicacion_etiqueta_id_publicacion_fkey FOREIGN KEY (id_publicacion) REFERENCES public.publicacion(id_publicacion) ON DELETE CASCADE;
ALTER TABLE ONLY public.publicacion_etiqueta ADD CONSTRAINT publicacion_etiqueta_id_etiqueta_fkey FOREIGN KEY (id_etiqueta) REFERENCES public.etiqueta(id_etiqueta) ON DELETE CASCADE;
ALTER TABLE ONLY public.imagen ADD CONSTRAINT imagen_id_publicacion_fkey FOREIGN KEY (id_publicacion) REFERENCES public.publicacion(id_publicacion) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.voto ADD CONSTRAINT voto_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON UPDATE CASCADE;
ALTER TABLE ONLY public.voto ADD CONSTRAINT voto_id_votante_fkey FOREIGN KEY (id_votante) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE;
ALTER TABLE ONLY public.comentario ADD CONSTRAINT comentario_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON UPDATE CASCADE;
ALTER TABLE ONLY public.comentario ADD CONSTRAINT comentario_id_comentador_fkey FOREIGN KEY (id_comentador) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE;
ALTER TABLE ONLY public.usuario_seguidor ADD CONSTRAINT usuario_seguidor_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.usuario_seguidor ADD CONSTRAINT usuario_seguidor_id_seguidor_fkey FOREIGN KEY (id_seguidor) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.denuncia ADD CONSTRAINT denuncia_id_denunciante_fkey FOREIGN KEY (id_denunciante) REFERENCES public.usuario(id_usuario);
ALTER TABLE ONLY public.denuncia ADD CONSTRAINT denuncia_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON DELETE CASCADE;
ALTER TABLE ONLY public.denuncia ADD CONSTRAINT denuncia_id_comentario_fkey FOREIGN KEY (id_comentario) REFERENCES public.comentario(id_comentario) ON DELETE CASCADE;
ALTER TABLE ONLY public.coleccion ADD CONSTRAINT coleccion_id_creador_fkey FOREIGN KEY (id_creador) REFERENCES public.usuario(id_usuario);
ALTER TABLE ONLY public.coleccion_imagen ADD CONSTRAINT coleccion_imagen_id_coleccion_fkey FOREIGN KEY (id_coleccion) REFERENCES public.coleccion(id_coleccion) ON DELETE CASCADE;
ALTER TABLE ONLY public.coleccion_imagen ADD CONSTRAINT coleccion_imagen_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON DELETE CASCADE;
ALTER TABLE ONLY public.interes ADD CONSTRAINT interes_id_interesado_fkey FOREIGN KEY (id_interesado) REFERENCES public.usuario(id_usuario);
ALTER TABLE ONLY public.interes ADD CONSTRAINT interes_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON DELETE CASCADE;
ALTER TABLE ONLY public.mensaje ADD CONSTRAINT mensaje_id_emisor_fkey FOREIGN KEY (id_emisor) REFERENCES public.usuario(id_usuario);
ALTER TABLE ONLY public.mensaje ADD CONSTRAINT mensaje_id_receptor_fkey FOREIGN KEY (id_receptor) REFERENCES public.usuario(id_usuario);
ALTER TABLE ONLY public.mensaje ADD CONSTRAINT mensaje_id_interes_fkey FOREIGN KEY (id_interes) REFERENCES public.interes(id_interes) ON DELETE CASCADE;
ALTER TABLE ONLY public.notificacion ADD CONSTRAINT notificacion_id_receptor_fkey FOREIGN KEY (id_receptor) REFERENCES public.usuario(id_usuario);
ALTER TABLE ONLY public.notificacion ADD CONSTRAINT notificacion_id_voto_fkey FOREIGN KEY (id_voto) REFERENCES public.voto(id_voto) ON DELETE SET NULL;
ALTER TABLE ONLY public.notificacion ADD CONSTRAINT notificacion_id_seguimiento_fkey FOREIGN KEY (id_seguimiento) REFERENCES public.usuario_seguidor(id_seguimiento) ON DELETE SET NULL;
ALTER TABLE ONLY public.notificacion ADD CONSTRAINT notificacion_id_comentario_fkey FOREIGN KEY (id_comentario) REFERENCES public.comentario(id_comentario) ON DELETE SET NULL;
ALTER TABLE ONLY public.notificacion ADD CONSTRAINT notificacion_id_denuncia_fkey FOREIGN KEY (id_denuncia) REFERENCES public.denuncia(id_denuncia) ON DELETE SET NULL;
ALTER TABLE ONLY public.notificacion ADD CONSTRAINT notificacion_id_interes_fkey FOREIGN KEY (id_interes) REFERENCES public.interes(id_interes) ON DELETE SET NULL;

-- INDEXES
CREATE INDEX idx_publicacion_creador ON public.publicacion USING btree (id_creador);
CREATE INDEX idx_voto_imagen ON public.voto USING btree (id_imagen);
CREATE INDEX idx_denuncia_imagen ON public.denuncia USING btree (id_imagen);
CREATE INDEX idx_coleccion_creador ON public.coleccion USING btree (id_creador);
CREATE INDEX idx_mensaje_interes ON public.mensaje USING btree (id_interes);
CREATE INDEX idx_notificacion_receptor ON public.notificacion USING btree (id_receptor);

-- DATA
INSERT INTO public.usuario (id_usuario, nombre, apellido, sexo, fecha_nacimiento, correo, contrasena, bio, avatar, estado, es_moderador, fecha_creacion, fecha_baja) VALUES
(1, 'marianela', 'rocamora', NULL, NULL, 'rocamoramarianela86@gmail.com', '$2b$10$UvvjmNGjmGUAXNahmOJY4exy7Rf0BnX37gpEiS6/xU.S7rpclEyzK', NULL, NULL, 'activo', false, '2026-05-17 17:04:04.852994-03', NULL),
(2, 'marianela', 'rocamora', NULL, NULL, 'maria@gmail.com', '$2b$10$wSn2vXHJsIgQ8Kl6Mv9cru/xkdXaVgkqcho72heM0divQQM4eH3EC', NULL, NULL, 'activo', false, '2026-05-17 20:59:44.505635-03', NULL),
(3, 'Lucas', 'Guimenez', 'M', '1999-06-20', 'lucas89@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'activo', false, '2026-05-20 08:11:10.39-03', NULL),
(4, 'Lourdes', 'Lopez', 'F', '2002-03-05', 'lourdeslopez@gmail.com', '$2b$10$S9P/AonIuUpkj6vXK/4fE.HTp00pWPNjvvNTkd0xYf1BXEwKl94Uq', NULL, NULL, 'activo', false, '2026-05-20 08:23:47.238-03', NULL),
(5, 'maximiliano', 'enriz', 'M', '2022-08-31', 'maxi_2002@gmail.com', '$2b$10$J/g3x0XixZCzlJwlcjJww.jWso.GthhTeqp34h3AcdEZMmZuMIZ7G', NULL, NULL, 'activo', false, '2026-05-20 08:26:54.196-03', NULL),
(6, 'Yesica', 'Cuello', 'F', '1999-11-22', 'yesi@gmail.com', '$2b$10$rOkqGsNK.eHfjR41/PUxc.c2mmYDiTUTpXg4eRJhnL56gKRcO66tK', 'Creativa , Me gusta los mates y caminar con mi perro', NULL, 'activo', false, '2026-06-01 20:48:40.088-03', NULL);

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 6, true);

INSERT INTO public.publicacion (id_publicacion, titulo, descripcion, fecha_publicacion, estado, id_creador) VALUES
(6, 'Catedral', NULL, '2026-05-19 21:19:13.341-03', 'activo', 2),
(8, 'Vacaciones en Potrero', 'Un lugar de San Luis , que visite en mis vacaciones', '2026-05-20 21:14:21.061-03', 'activo', 2),
(9, 'La Punta', 'visitando lugares', '2026-05-20 21:58:01.124-03', 'activo', 2),
(10, 'La Punta', NULL, '2026-05-21 07:36:04.173-03', 'activo', 5),
(11, 'Monasterio', 'Un lindo lugar para conocer en san luis', '2026-05-21 07:45:50.694-03', 'activo', 5),
(14, 'Cabildo de la Punta', 'Feliz 25 de mayo !', '2026-05-24 20:06:29.246-03', 'activo', 2),
(15, 'Desfile 25 de Mayo', 'Desfile tradicional en Av.España', '2026-05-24 20:28:48.756-03', 'activo', 2),
(16, 'La Carolina', 'Una tarde conociendo pueblitos de San Luis', '2026-05-29 08:46:00.893-03', 'activo', 2),
(17, 'Doggi', 'Mi perrito doggi en el parque', '2026-06-01 20:51:04.732-03', 'activo', 6),
(18, 'puppy', 'Mi otra perrita puppy', '2026-06-01 20:54:54.481-03', 'activo', 6);

SELECT pg_catalog.setval('public.publicacion_id_publicacion_seq', 18, true);

INSERT INTO public.etiqueta (id_etiqueta, nombre_etiqueta) VALUES
(1, 'fotografia'), (2, 'paisaje'), (3, 'naturaleza'), (4, 'vacaciones'),
(5, 'turismo'), (6, 'argentina'), (7, 'san luis'), (8, 'patrimonio'),
(9, 'historia'), (10, 'patria'), (11, 'desfile'), (12, 'arquitectura'),
(13, 'relax'), (14, 'perros'), (15, 'adorable'), (16, 'amor');

SELECT pg_catalog.setval('public.etiqueta_id_etiqueta_seq', 16, true);

INSERT INTO public.publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES
(8,4),(8,5),(8,7),(8,13),(9,5),(9,7),(9,12),(10,5),(10,7),(10,6),
(11,8),(11,9),(11,12),(14,8),(14,9),(14,7),(15,10),(15,11),(15,6),
(16,3),(16,13),(16,7),(17,14),(17,15),(18,16),(18,14),(6,1),(6,2);

INSERT INTO public.imagen (id_imagen, foto, ancho, altura, licencia, marca_de_agua, texto_marca, fecha_subida, estado, comentario_clausurado, id_publicacion) VALUES
(8, '/uploads/1779322460993.jpg', NULL, NULL, 'copyright', true, '@maria', '2026-05-20 21:14:21.235-03', 'activo', true, 8),
(9, '/uploads/1779325081097.jpg', NULL, NULL, 'copyright', true, '@maria', '2026-05-20 21:58:01.331-03', 'activo', true, 9),
(10, '/uploads/1779359764154.jpg', 1050, 857, 'sin_copyright', true, NULL, '2026-05-21 07:36:04.326-03', 'activo', false, 10),
(11, '/uploads/1779360350644.jpg', 1000, 563, 'copyright', true, '@maxi', '2026-05-21 07:45:51.25-03', 'activo', false, 11),
(14, '/uploads/1779663989235.jpg', 550, 412, 'sin_copyright', true, NULL, '2026-05-24 20:06:29.363-03', 'activo', true, 14),
(15, '/uploads/1779665328743.jpg', 900, 599, 'sin_copyright', true, NULL, '2026-05-24 20:28:48.933-03', 'activo', false, 15),
(16, '/uploads/1780055160839.jpg', 300, 168, 'copyright', true, '@maria', '2026-05-29 08:46:01.031-03', 'activo', false, 16),
(17, '/uploads/1780055160840.jpg', 275, 183, 'copyright', true, '@maria', '2026-05-29 08:46:01.044-03', 'activo', false, 16),
(18, '/uploads/1780357864680.jpg', 865, 540, 'sin_copyright', true, NULL, '2026-06-01 20:51:04.851-03', 'activo', false, 17),
(19, '/uploads/1780358094446.jpg', 510, 510, 'sin_copyright', true, NULL, '2026-06-01 20:54:54.635-03', 'activo', false, 18),
(20, '/uploads/1780359320248.jpg', 275, 183, 'sin_copyright', true, NULL, '2026-06-01 21:15:20.408-03', 'activo', false, 6);

SELECT pg_catalog.setval('public.imagen_id_imagen_seq', 20, true);

INSERT INTO public.voto (id_voto, valoracion, fecha_voto, id_votante, id_imagen) VALUES
(2, 3, '2026-05-21 07:39:08.25-03', 5, 9),
(3, 5, '2026-06-01 20:18:50.675-03', 2, 11),
(4, 5, '2026-06-01 21:15:54.399-03', 2, 10),
(5, 4, '2026-06-02 08:50:53.605-03', 2, 19),
(6, 5, '2026-06-02 08:50:58.924-03', 2, 18);

SELECT pg_catalog.setval('public.voto_id_voto_seq', 6, true);

INSERT INTO public.comentario (id_comentario, texto, fecha_comentario, estado, id_comentador, id_imagen) VALUES
(2, 'muy linda foto!', '2026-05-21 07:39:25.612-03', 'activo', 5, 9),
(3, 'que lindas fotos maxi', '2026-05-22 08:02:09.876-03', 'activo', 2, 11),
(4, 'que linda foto maxi', '2026-05-22 08:26:56.388-03', 'activo', 2, 11),
(5, 'comentario', '2026-05-22 08:36:14.04-03', 'activo', 2, 10),
(6, 'comentario 2', '2026-05-22 08:45:08.678-03', 'activo', 2, 10);

SELECT pg_catalog.setval('public.comentario_id_comentario_seq', 7, true);

INSERT INTO public.usuario_seguidor (id_seguimiento, id_usuario, id_seguidor, fecha_seguimiento) VALUES
(2, 3, 2, '2026-05-22 07:38:24.802-03'),
(5, 5, 2, '2026-06-01 19:55:24.486-03'),
(6, 5, 6, '2026-06-01 20:51:34.246-03'),
(7, 2, 6, '2026-06-01 20:51:50.662-03');

SELECT pg_catalog.setval('public.usuario_seguidor_id_seguimiento_seq', 7, true);