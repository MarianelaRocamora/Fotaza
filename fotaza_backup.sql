--
-- PostgreSQL database dump
--

\restrict mplW8BimAiE5jQjjXw6e1TElMNlUbuisVn0MXIHbSbnVNayZSgODluU68zbH3z1

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-03 08:13:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 252 (class 1259 OID 16625)
-- Name: coleccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleccion (
    id_coleccion integer NOT NULL,
    titulo character varying(100) NOT NULL,
    fecha_coleccion timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    id_creador integer NOT NULL,
    CONSTRAINT coleccion_estado_check CHECK (((estado)::text = ANY ((ARRAY['activo'::character varying, 'inactivo'::character varying])::text[])))
);


ALTER TABLE public.coleccion OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16624)
-- Name: coleccion_id_coleccion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleccion_id_coleccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleccion_id_coleccion_seq OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 251
-- Name: coleccion_id_coleccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coleccion_id_coleccion_seq OWNED BY public.coleccion.id_coleccion;


--
-- TOC entry 253 (class 1259 OID 16644)
-- Name: coleccion_imagen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleccion_imagen (
    id_coleccion integer NOT NULL,
    id_imagen integer NOT NULL
);


ALTER TABLE public.coleccion_imagen OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16513)
-- Name: comentario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comentario (
    id_comentario integer NOT NULL,
    texto text NOT NULL,
    fecha_comentario timestamp with time zone,
    estado character varying(20) DEFAULT 'activo'::character varying,
    id_comentador integer NOT NULL,
    id_imagen integer NOT NULL,
    CONSTRAINT comentario_estado_check CHECK (((estado)::text = ANY (ARRAY[('activo'::character varying)::text, ('eliminado'::character varying)::text])))
);


ALTER TABLE public.comentario OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16512)
-- Name: comentario_id_comentario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comentario_id_comentario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comentario_id_comentario_seq OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 243
-- Name: comentario_id_comentario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comentario_id_comentario_seq OWNED BY public.comentario.id_comentario;


--
-- TOC entry 248 (class 1259 OID 16567)
-- Name: denuncia; Type: TABLE; Schema: public; Owner: postgres
--

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
    CONSTRAINT denuncia_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'desestimada'::character varying, 'aceptada'::character varying])::text[])))
);


ALTER TABLE public.denuncia OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16566)
-- Name: denuncia_id_denuncia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.denuncia_id_denuncia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.denuncia_id_denuncia_seq OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 247
-- Name: denuncia_id_denuncia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.denuncia_id_denuncia_seq OWNED BY public.denuncia.id_denuncia;


--
-- TOC entry 242 (class 1259 OID 16485)
-- Name: etiqueta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etiqueta (
    id_etiqueta integer NOT NULL,
    nombre_etiqueta character varying(50) NOT NULL
);


ALTER TABLE public.etiqueta OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16484)
-- Name: etiqueta_id_etiqueta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etiqueta_id_etiqueta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etiqueta_id_etiqueta_seq OWNER TO postgres;

--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 241
-- Name: etiqueta_id_etiqueta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etiqueta_id_etiqueta_seq OWNED BY public.etiqueta.id_etiqueta;


--
-- TOC entry 240 (class 1259 OID 16449)
-- Name: imagen; Type: TABLE; Schema: public; Owner: postgres
--

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
    CONSTRAINT imagen_estado_check CHECK (((estado)::text = ANY (ARRAY[('activo'::character varying)::text, ('inactivo'::character varying)::text, ('bajada'::character varying)::text]))),
    CONSTRAINT imagen_licencia_check CHECK (((licencia)::text = ANY (ARRAY[('copyright'::character varying)::text, ('sin_copyright'::character varying)::text])))
);


ALTER TABLE public.imagen OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16448)
-- Name: imagen_id_imagen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.imagen_id_imagen_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.imagen_id_imagen_seq OWNER TO postgres;

--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 239
-- Name: imagen_id_imagen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.imagen_id_imagen_seq OWNED BY public.imagen.id_imagen;


--
-- TOC entry 255 (class 1259 OID 16662)
-- Name: interes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interes (
    id_interes integer NOT NULL,
    id_interesado integer NOT NULL,
    id_imagen integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.interes OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 16661)
-- Name: interes_id_interes_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interes_id_interes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interes_id_interes_seq OWNER TO postgres;

--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 254
-- Name: interes_id_interes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interes_id_interes_seq OWNED BY public.interes.id_interes;


--
-- TOC entry 257 (class 1259 OID 16686)
-- Name: mensaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mensaje (
    id_mensaje integer NOT NULL,
    texto text NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_emisor integer NOT NULL,
    id_receptor integer NOT NULL,
    id_interes integer NOT NULL
);


ALTER TABLE public.mensaje OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 16685)
-- Name: mensaje_id_mensaje_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mensaje_id_mensaje_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mensaje_id_mensaje_seq OWNER TO postgres;

--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 256
-- Name: mensaje_id_mensaje_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mensaje_id_mensaje_seq OWNED BY public.mensaje.id_mensaje;


--
-- TOC entry 259 (class 1259 OID 16717)
-- Name: notificacion; Type: TABLE; Schema: public; Owner: postgres
--

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
    CONSTRAINT notificacion_estado_check CHECK (((estado)::text = ANY ((ARRAY['leida'::character varying, 'no_leida'::character varying])::text[]))),
    CONSTRAINT notificacion_tipo_notificacion_check CHECK (((tipo_notificacion)::text = ANY ((ARRAY['comentario'::character varying, 'valoracion'::character varying, 'me_interesa'::character varying, 'nuevo_seguidor'::character varying])::text[])))
);


ALTER TABLE public.notificacion OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 16716)
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificacion_id_notificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNER TO postgres;

--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 258
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNED BY public.notificacion.id_notificacion;


--
-- TOC entry 238 (class 1259 OID 16425)
-- Name: publicacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publicacion (
    id_publicacion integer NOT NULL,
    titulo character varying(200) NOT NULL,
    descripcion text,
    fecha_publicacion timestamp with time zone,
    estado character varying(20) DEFAULT 'activo'::character varying,
    id_creador integer NOT NULL,
    CONSTRAINT publicacion_estado_check CHECK (((estado)::text = ANY (ARRAY[('activo'::character varying)::text, ('inactivo'::character varying)::text, ('bajada'::character varying)::text])))
);


ALTER TABLE public.publicacion OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 17150)
-- Name: publicacion_etiqueta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publicacion_etiqueta (
    id_publicacion integer NOT NULL,
    id_etiqueta integer NOT NULL
);


ALTER TABLE public.publicacion_etiqueta OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16424)
-- Name: publicacion_id_publicacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publicacion_id_publicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publicacion_id_publicacion_seq OWNER TO postgres;

--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 237
-- Name: publicacion_id_publicacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publicacion_id_publicacion_seq OWNED BY public.publicacion.id_publicacion;


--
-- TOC entry 236 (class 1259 OID 16402)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

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
    CONSTRAINT usuario_estado_check CHECK (((estado)::text = ANY (ARRAY[('activo'::character varying)::text, ('inactivo'::character varying)::text, ('suspendido'::character varying)::text]))),
    CONSTRAINT usuario_sexo_check CHECK ((sexo = ANY (ARRAY['M'::bpchar, 'F'::bpchar, 'O'::bpchar])))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16401)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 235
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 250 (class 1259 OID 16600)
-- Name: usuario_seguidor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_seguidor (
    id_seguimiento integer NOT NULL,
    id_usuario integer NOT NULL,
    id_seguidor integer NOT NULL,
    fecha_seguimiento timestamp with time zone,
    CONSTRAINT usuario_seguidor_check CHECK ((id_usuario <> id_seguidor))
);


ALTER TABLE public.usuario_seguidor OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16599)
-- Name: usuario_seguidor_id_seguimiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_seguidor_id_seguimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_seguidor_id_seguimiento_seq OWNER TO postgres;

--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 249
-- Name: usuario_seguidor_id_seguimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_seguidor_id_seguimiento_seq OWNED BY public.usuario_seguidor.id_seguimiento;


--
-- TOC entry 246 (class 1259 OID 16541)
-- Name: voto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voto (
    id_voto integer NOT NULL,
    valoracion integer NOT NULL,
    fecha_voto timestamp with time zone,
    id_votante integer NOT NULL,
    id_imagen integer NOT NULL,
    CONSTRAINT voto_valoracion_check CHECK (((valoracion >= 1) AND (valoracion <= 5)))
);


ALTER TABLE public.voto OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16540)
-- Name: voto_id_voto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.voto_id_voto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.voto_id_voto_seq OWNER TO postgres;

--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 245
-- Name: voto_id_voto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.voto_id_voto_seq OWNED BY public.voto.id_voto;


--
-- TOC entry 4953 (class 2604 OID 16628)
-- Name: coleccion id_coleccion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion ALTER COLUMN id_coleccion SET DEFAULT nextval('public.coleccion_id_coleccion_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 16516)
-- Name: comentario id_comentario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentario ALTER COLUMN id_comentario SET DEFAULT nextval('public.comentario_id_comentario_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 16570)
-- Name: denuncia id_denuncia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncia ALTER COLUMN id_denuncia SET DEFAULT nextval('public.denuncia_id_denuncia_seq'::regclass);


--
-- TOC entry 4945 (class 2604 OID 16488)
-- Name: etiqueta id_etiqueta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta ALTER COLUMN id_etiqueta SET DEFAULT nextval('public.etiqueta_id_etiqueta_seq'::regclass);


--
-- TOC entry 4940 (class 2604 OID 16452)
-- Name: imagen id_imagen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagen ALTER COLUMN id_imagen SET DEFAULT nextval('public.imagen_id_imagen_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 16665)
-- Name: interes id_interes; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interes ALTER COLUMN id_interes SET DEFAULT nextval('public.interes_id_interes_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 16689)
-- Name: mensaje id_mensaje; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensaje ALTER COLUMN id_mensaje SET DEFAULT nextval('public.mensaje_id_mensaje_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 16720)
-- Name: notificacion id_notificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificacion_id_notificacion_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 16428)
-- Name: publicacion id_publicacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion ALTER COLUMN id_publicacion SET DEFAULT nextval('public.publicacion_id_publicacion_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 16405)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 16603)
-- Name: usuario_seguidor id_seguimiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_seguidor ALTER COLUMN id_seguimiento SET DEFAULT nextval('public.usuario_seguidor_id_seguimiento_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 16544)
-- Name: voto id_voto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto ALTER COLUMN id_voto SET DEFAULT nextval('public.voto_id_voto_seq'::regclass);


--
-- TOC entry 5223 (class 0 OID 16625)
-- Dependencies: 252
-- Data for Name: coleccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coleccion (id_coleccion, titulo, fecha_coleccion, estado, id_creador) FROM stdin;
\.


--
-- TOC entry 5224 (class 0 OID 16644)
-- Dependencies: 253
-- Data for Name: coleccion_imagen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coleccion_imagen (id_coleccion, id_imagen) FROM stdin;
\.


--
-- TOC entry 5215 (class 0 OID 16513)
-- Dependencies: 244
-- Data for Name: comentario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comentario (id_comentario, texto, fecha_comentario, estado, id_comentador, id_imagen) FROM stdin;
2	muy linda foto!	2026-05-21 07:39:25.612-03	activo	5	9
3	que lindas fotos maxi	2026-05-22 08:02:09.876-03	activo	2	11
4	que linda foto maxi	2026-05-22 08:26:56.388-03	activo	2	11
5	❄️​☃️​⛄​	2026-05-22 08:36:14.04-03	activo	2	10
6	​❄️​❄️​	2026-05-22 08:45:08.678-03	activo	2	10
\.


--
-- TOC entry 5219 (class 0 OID 16567)
-- Dependencies: 248
-- Data for Name: denuncia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.denuncia (id_denuncia, motivo, descripcion, fecha_denuncia, estado, id_denunciante, id_imagen, id_comentario) FROM stdin;
\.


--
-- TOC entry 5213 (class 0 OID 16485)
-- Dependencies: 242
-- Data for Name: etiqueta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etiqueta (id_etiqueta, nombre_etiqueta) FROM stdin;
1	fotografia
2	paisaje
3	naturaleza
4	vacaciones
5	turismo
6	argentina
7	san luis
8	patrimonio
9	historia
10	patria
11	desfile
12	arquitectura
13	relax
14	perros
15	adorable
16	amor
\.


--
-- TOC entry 5211 (class 0 OID 16449)
-- Dependencies: 240
-- Data for Name: imagen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imagen (id_imagen, foto, ancho, altura, licencia, marca_de_agua, texto_marca, fecha_subida, estado, comentario_clausurado, id_publicacion) FROM stdin;
10	/uploads/1779359764154.jpg	1050	857	sin_copyright	t	\N	2026-05-21 07:36:04.326-03	activo	f	10
11	/uploads/1779360350644.jpg	1000	563	copyright	t	@maxi	2026-05-21 07:45:51.25-03	activo	f	11
9	/uploads/1779325081097.jpg	\N	\N	copyright	t	@maria	2026-05-20 21:58:01.331-03	activo	t	9
14	/uploads/1779663989235.jpg	550	412	sin_copyright	t	\N	2026-05-24 20:06:29.363-03	activo	t	14
8	/uploads/1779322460993.jpg	\N	\N	copyright	t	@maria	2026-05-20 21:14:21.235-03	activo	t	8
15	/uploads/1779665328743.jpg	900	599	sin_copyright	t	\N	2026-05-24 20:28:48.933-03	activo	f	15
16	/uploads/1780055160839.jpg	300	168	copyright	t	@maria	2026-05-29 08:46:01.031-03	activo	f	16
17	/uploads/1780055160840.jpg	275	183	copyright	t	@maria	2026-05-29 08:46:01.044-03	activo	f	16
18	/uploads/1780357864680.jpg	865	540	sin_copyright	t	\N	2026-06-01 20:51:04.851-03	activo	f	17
19	/uploads/1780358094446.jpg	510	510	sin_copyright	t	\N	2026-06-01 20:54:54.635-03	activo	f	18
20	/uploads/1780359320248.jpg	275	183	sin_copyright	t	\N	2026-06-01 21:15:20.408-03	activo	f	6
\.


--
-- TOC entry 5226 (class 0 OID 16662)
-- Dependencies: 255
-- Data for Name: interes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interes (id_interes, id_interesado, id_imagen, fecha) FROM stdin;
\.


--
-- TOC entry 5228 (class 0 OID 16686)
-- Dependencies: 257
-- Data for Name: mensaje; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mensaje (id_mensaje, texto, fecha, id_emisor, id_receptor, id_interes) FROM stdin;
\.


--
-- TOC entry 5230 (class 0 OID 16717)
-- Dependencies: 259
-- Data for Name: notificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificacion (id_notificacion, tipo_notificacion, descripcion, fecha_notificacion, estado, id_receptor, id_voto, id_seguimiento, id_comentario, id_denuncia, id_interes) FROM stdin;
\.


--
-- TOC entry 5209 (class 0 OID 16425)
-- Dependencies: 238
-- Data for Name: publicacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publicacion (id_publicacion, titulo, descripcion, fecha_publicacion, estado, id_creador) FROM stdin;
8	Vacaciones en Potrero	Un lugar de San Luis , que visite en mis vacaciones 	2026-05-20 21:14:21.061-03	activo	2
9	La Punta 	visitando lugares	2026-05-20 21:58:01.124-03	activo	2
10	La Punta 		2026-05-21 07:36:04.173-03	activo	5
14	Cabildo de la Punta	Feliz 25 de mayo ! 	2026-05-24 20:06:29.246-03	activo	2
15	Desfile 25 de Mayo 	Desfile tradicional en Av.España 	2026-05-24 20:28:48.756-03	activo	2
11	Monasterio 	Un lindo lugar para conocer en san luis 	2026-05-21 07:45:50.694-03	activo	5
16	La Carolina	Una tarde conociendo pueblitos de San Luis 	2026-05-29 08:46:00.893-03	activo	2
17	Doggi	Mi perrito doggi en el parque 	2026-06-01 20:51:04.732-03	activo	6
18	puppy	Mi otra perrita puppy 	2026-06-01 20:54:54.481-03	activo	6
6	Catedral		2026-05-19 21:19:13.341-03	activo	2
\.


--
-- TOC entry 5231 (class 0 OID 17150)
-- Dependencies: 260
-- Data for Name: publicacion_etiqueta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publicacion_etiqueta (id_publicacion, id_etiqueta) FROM stdin;
8	4
8	5
8	7
8	13
9	5
9	7
9	12
10	5
10	7
10	6
11	8
11	9
11	12
14	8
14	9
14	7
15	10
15	11
15	6
16	3
16	13
16	7
17	14
17	15
18	16
18	14
6	1
6	2
\.


--
-- TOC entry 5207 (class 0 OID 16402)
-- Dependencies: 236
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre, apellido, sexo, fecha_nacimiento, correo, contrasena, bio, avatar, estado, es_moderador, fecha_creacion, fecha_baja) FROM stdin;
1	marianela	rocamora	\N	\N	rocamoramarianela86@gmail.com	$2b$10$UvvjmNGjmGUAXNahmOJY4exy7Rf0BnX37gpEiS6/xU.S7rpclEyzK	\N	\N	activo	f	2026-05-17 17:04:04.852994-03	\N
2	marianela	rocamora	\N	\N	maria@gmail.com	$2b$10$wSn2vXHJsIgQ8Kl6Mv9cru/xkdXaVgkqcho72heM0divQQM4eH3EC	\N	\N	activo	f	2026-05-17 20:59:44.505635-03	\N
4	Lourdes	Lopez	F	2002-03-05	lourdeslopez@gmail.com	$2b$10$S9P/AonIuUpkj6vXK/4fE.HTp00pWPNjvvNTkd0xYf1BXEwKl94Uq	\N	\N	activo	f	2026-05-20 08:23:47.238-03	\N
5	maximiliano	enriz	M	2022-08-31	maxi_2002@gmail.com	$2b$10$J/g3x0XixZCzlJwlcjJww.jWso.GthhTeqp34h3AcdEZMmZuMIZ7G	\N	\N	activo	f	2026-05-20 08:26:54.196-03	\N
3	Lucas	Guimenez	M	1999-06-20	lucas89@gmail.com	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	\N	\N	activo	f	2026-05-20 08:11:10.39-03	\N
6	Yesica	Cuello 	F	1999-11-22	yesi@gmail.com	$2b$10$rOkqGsNK.eHfjR41/PUxc.c2mmYDiTUTpXg4eRJhnL56gKRcO66tK	Creativa , Me gusta los mates y caminar con mi perro 	\N	activo	f	2026-06-01 20:48:40.088-03	\N
\.


--
-- TOC entry 5221 (class 0 OID 16600)
-- Dependencies: 250
-- Data for Name: usuario_seguidor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_seguidor (id_seguimiento, id_usuario, id_seguidor, fecha_seguimiento) FROM stdin;
2	3	2	2026-05-22 07:38:24.802-03
5	5	2	2026-06-01 19:55:24.486-03
6	5	6	2026-06-01 20:51:34.246-03
7	2	6	2026-06-01 20:51:50.662-03
\.


--
-- TOC entry 5217 (class 0 OID 16541)
-- Dependencies: 246
-- Data for Name: voto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.voto (id_voto, valoracion, fecha_voto, id_votante, id_imagen) FROM stdin;
2	3	2026-05-21 07:39:08.25-03	5	9
3	5	2026-06-01 20:18:50.675-03	2	11
4	5	2026-06-01 21:15:54.399-03	2	10
5	4	2026-06-02 08:50:53.605-03	2	19
6	5	2026-06-02 08:50:58.924-03	2	18
\.


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 251
-- Name: coleccion_id_coleccion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coleccion_id_coleccion_seq', 1, false);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 243
-- Name: comentario_id_comentario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comentario_id_comentario_seq', 7, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 247
-- Name: denuncia_id_denuncia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.denuncia_id_denuncia_seq', 1, false);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 241
-- Name: etiqueta_id_etiqueta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etiqueta_id_etiqueta_seq', 16, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 239
-- Name: imagen_id_imagen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.imagen_id_imagen_seq', 20, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 254
-- Name: interes_id_interes_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interes_id_interes_seq', 1, false);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 256
-- Name: mensaje_id_mensaje_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mensaje_id_mensaje_seq', 1, false);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 258
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificacion_id_notificacion_seq', 1, false);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 237
-- Name: publicacion_id_publicacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publicacion_id_publicacion_seq', 18, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 235
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 6, true);


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 249
-- Name: usuario_seguidor_id_seguimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_seguidor_id_seguimiento_seq', 7, true);


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 245
-- Name: voto_id_voto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.voto_id_voto_seq', 6, true);


--
-- TOC entry 5019 (class 2606 OID 16650)
-- Name: coleccion_imagen coleccion_imagen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion_imagen
    ADD CONSTRAINT coleccion_imagen_pkey PRIMARY KEY (id_coleccion, id_imagen);


--
-- TOC entry 5016 (class 2606 OID 16638)
-- Name: coleccion coleccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion
    ADD CONSTRAINT coleccion_pkey PRIMARY KEY (id_coleccion);


--
-- TOC entry 5002 (class 2606 OID 16529)
-- Name: comentario comentario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentario
    ADD CONSTRAINT comentario_pkey PRIMARY KEY (id_comentario);


--
-- TOC entry 5009 (class 2606 OID 16583)
-- Name: denuncia denuncia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncia
    ADD CONSTRAINT denuncia_pkey PRIMARY KEY (id_denuncia);


--
-- TOC entry 4992 (class 2606 OID 17064)
-- Name: etiqueta etiqueta_nombre_etiqueta_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta
    ADD CONSTRAINT etiqueta_nombre_etiqueta_key UNIQUE (nombre_etiqueta);


--
-- TOC entry 4994 (class 2606 OID 17066)
-- Name: etiqueta etiqueta_nombre_etiqueta_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta
    ADD CONSTRAINT etiqueta_nombre_etiqueta_key1 UNIQUE (nombre_etiqueta);


--
-- TOC entry 4996 (class 2606 OID 17068)
-- Name: etiqueta etiqueta_nombre_etiqueta_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta
    ADD CONSTRAINT etiqueta_nombre_etiqueta_key2 UNIQUE (nombre_etiqueta);


--
-- TOC entry 4998 (class 2606 OID 17070)
-- Name: etiqueta etiqueta_nombre_etiqueta_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta
    ADD CONSTRAINT etiqueta_nombre_etiqueta_key3 UNIQUE (nombre_etiqueta);


--
-- TOC entry 5000 (class 2606 OID 16492)
-- Name: etiqueta etiqueta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta
    ADD CONSTRAINT etiqueta_pkey PRIMARY KEY (id_etiqueta);


--
-- TOC entry 4990 (class 2606 OID 16466)
-- Name: imagen imagen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagen
    ADD CONSTRAINT imagen_pkey PRIMARY KEY (id_imagen);


--
-- TOC entry 5021 (class 2606 OID 16674)
-- Name: interes interes_id_interesado_id_imagen_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interes
    ADD CONSTRAINT interes_id_interesado_id_imagen_key UNIQUE (id_interesado, id_imagen);


--
-- TOC entry 5023 (class 2606 OID 16672)
-- Name: interes interes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interes
    ADD CONSTRAINT interes_pkey PRIMARY KEY (id_interes);


--
-- TOC entry 5026 (class 2606 OID 16700)
-- Name: mensaje mensaje_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT mensaje_pkey PRIMARY KEY (id_mensaje);


--
-- TOC entry 5029 (class 2606 OID 16733)
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id_notificacion);


--
-- TOC entry 5031 (class 2606 OID 17156)
-- Name: publicacion_etiqueta publicacion_etiqueta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion_etiqueta
    ADD CONSTRAINT publicacion_etiqueta_pkey PRIMARY KEY (id_publicacion, id_etiqueta);


--
-- TOC entry 4988 (class 2606 OID 16442)
-- Name: publicacion publicacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion
    ADD CONSTRAINT publicacion_pkey PRIMARY KEY (id_publicacion);


--
-- TOC entry 4977 (class 2606 OID 17036)
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- TOC entry 4979 (class 2606 OID 17038)
-- Name: usuario usuario_correo_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key1 UNIQUE (correo);


--
-- TOC entry 4981 (class 2606 OID 17040)
-- Name: usuario usuario_correo_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key2 UNIQUE (correo);


--
-- TOC entry 4983 (class 2606 OID 17042)
-- Name: usuario usuario_correo_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key3 UNIQUE (correo);


--
-- TOC entry 4985 (class 2606 OID 16421)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5012 (class 2606 OID 17134)
-- Name: usuario_seguidor usuario_seguidor_id_usuario_id_seguidor_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_seguidor
    ADD CONSTRAINT usuario_seguidor_id_usuario_id_seguidor_key UNIQUE (id_usuario, id_seguidor);


--
-- TOC entry 5014 (class 2606 OID 16611)
-- Name: usuario_seguidor usuario_seguidor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_seguidor
    ADD CONSTRAINT usuario_seguidor_pkey PRIMARY KEY (id_seguimiento);


--
-- TOC entry 5005 (class 2606 OID 17100)
-- Name: voto voto_id_votante_id_imagen_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto
    ADD CONSTRAINT voto_id_votante_id_imagen_key UNIQUE (id_votante, id_imagen);


--
-- TOC entry 5007 (class 2606 OID 16553)
-- Name: voto voto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto
    ADD CONSTRAINT voto_pkey PRIMARY KEY (id_voto);


--
-- TOC entry 5017 (class 1259 OID 16769)
-- Name: idx_coleccion_creador; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coleccion_creador ON public.coleccion USING btree (id_creador);


--
-- TOC entry 5010 (class 1259 OID 16767)
-- Name: idx_denuncia_imagen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_denuncia_imagen ON public.denuncia USING btree (id_imagen);


--
-- TOC entry 5024 (class 1259 OID 16770)
-- Name: idx_mensaje_interes; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mensaje_interes ON public.mensaje USING btree (id_interes);


--
-- TOC entry 5027 (class 1259 OID 16768)
-- Name: idx_notificacion_receptor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notificacion_receptor ON public.notificacion USING btree (id_receptor);


--
-- TOC entry 4986 (class 1259 OID 17054)
-- Name: idx_publicacion_creador; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_publicacion_creador ON public.publicacion USING btree (id_creador);


--
-- TOC entry 5003 (class 1259 OID 17101)
-- Name: idx_voto_imagen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_voto_imagen ON public.voto USING btree (id_imagen);


--
-- TOC entry 5043 (class 2606 OID 16639)
-- Name: coleccion coleccion_id_creador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion
    ADD CONSTRAINT coleccion_id_creador_fkey FOREIGN KEY (id_creador) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5044 (class 2606 OID 16651)
-- Name: coleccion_imagen coleccion_imagen_id_coleccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion_imagen
    ADD CONSTRAINT coleccion_imagen_id_coleccion_fkey FOREIGN KEY (id_coleccion) REFERENCES public.coleccion(id_coleccion) ON DELETE CASCADE;


--
-- TOC entry 5045 (class 2606 OID 16656)
-- Name: coleccion_imagen coleccion_imagen_id_imagen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion_imagen
    ADD CONSTRAINT coleccion_imagen_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON DELETE CASCADE;


--
-- TOC entry 5034 (class 2606 OID 17113)
-- Name: comentario comentario_id_comentador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentario
    ADD CONSTRAINT comentario_id_comentador_fkey FOREIGN KEY (id_comentador) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE;


--
-- TOC entry 5035 (class 2606 OID 17119)
-- Name: comentario comentario_id_imagen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentario
    ADD CONSTRAINT comentario_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON UPDATE CASCADE;


--
-- TOC entry 5038 (class 2606 OID 16594)
-- Name: denuncia denuncia_id_comentario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncia
    ADD CONSTRAINT denuncia_id_comentario_fkey FOREIGN KEY (id_comentario) REFERENCES public.comentario(id_comentario) ON DELETE CASCADE;


--
-- TOC entry 5039 (class 2606 OID 16584)
-- Name: denuncia denuncia_id_denunciante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncia
    ADD CONSTRAINT denuncia_id_denunciante_fkey FOREIGN KEY (id_denunciante) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5040 (class 2606 OID 16589)
-- Name: denuncia denuncia_id_imagen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncia
    ADD CONSTRAINT denuncia_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON DELETE CASCADE;


--
-- TOC entry 5033 (class 2606 OID 17084)
-- Name: imagen imagen_id_publicacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagen
    ADD CONSTRAINT imagen_id_publicacion_fkey FOREIGN KEY (id_publicacion) REFERENCES public.publicacion(id_publicacion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5046 (class 2606 OID 16680)
-- Name: interes interes_id_imagen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interes
    ADD CONSTRAINT interes_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON DELETE CASCADE;


--
-- TOC entry 5047 (class 2606 OID 16675)
-- Name: interes interes_id_interesado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interes
    ADD CONSTRAINT interes_id_interesado_fkey FOREIGN KEY (id_interesado) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5048 (class 2606 OID 16701)
-- Name: mensaje mensaje_id_emisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT mensaje_id_emisor_fkey FOREIGN KEY (id_emisor) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5049 (class 2606 OID 16711)
-- Name: mensaje mensaje_id_interes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT mensaje_id_interes_fkey FOREIGN KEY (id_interes) REFERENCES public.interes(id_interes) ON DELETE CASCADE;


--
-- TOC entry 5050 (class 2606 OID 16706)
-- Name: mensaje mensaje_id_receptor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT mensaje_id_receptor_fkey FOREIGN KEY (id_receptor) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5051 (class 2606 OID 16749)
-- Name: notificacion notificacion_id_comentario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_comentario_fkey FOREIGN KEY (id_comentario) REFERENCES public.comentario(id_comentario) ON DELETE SET NULL;


--
-- TOC entry 5052 (class 2606 OID 16754)
-- Name: notificacion notificacion_id_denuncia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_denuncia_fkey FOREIGN KEY (id_denuncia) REFERENCES public.denuncia(id_denuncia) ON DELETE SET NULL;


--
-- TOC entry 5053 (class 2606 OID 16759)
-- Name: notificacion notificacion_id_interes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_interes_fkey FOREIGN KEY (id_interes) REFERENCES public.interes(id_interes) ON DELETE SET NULL;


--
-- TOC entry 5054 (class 2606 OID 16734)
-- Name: notificacion notificacion_id_receptor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_receptor_fkey FOREIGN KEY (id_receptor) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5055 (class 2606 OID 16744)
-- Name: notificacion notificacion_id_seguimiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_seguimiento_fkey FOREIGN KEY (id_seguimiento) REFERENCES public.usuario_seguidor(id_seguimiento) ON DELETE SET NULL;


--
-- TOC entry 5056 (class 2606 OID 16739)
-- Name: notificacion notificacion_id_voto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_voto_fkey FOREIGN KEY (id_voto) REFERENCES public.voto(id_voto) ON DELETE SET NULL;


--
-- TOC entry 5057 (class 2606 OID 17162)
-- Name: publicacion_etiqueta publicacion_etiqueta_id_etiqueta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion_etiqueta
    ADD CONSTRAINT publicacion_etiqueta_id_etiqueta_fkey FOREIGN KEY (id_etiqueta) REFERENCES public.etiqueta(id_etiqueta) ON DELETE CASCADE;


--
-- TOC entry 5058 (class 2606 OID 17157)
-- Name: publicacion_etiqueta publicacion_etiqueta_id_publicacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion_etiqueta
    ADD CONSTRAINT publicacion_etiqueta_id_publicacion_fkey FOREIGN KEY (id_publicacion) REFERENCES public.publicacion(id_publicacion) ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 17056)
-- Name: publicacion publicacion_id_creador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion
    ADD CONSTRAINT publicacion_id_creador_fkey FOREIGN KEY (id_creador) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE;


--
-- TOC entry 5041 (class 2606 OID 17136)
-- Name: usuario_seguidor usuario_seguidor_id_seguidor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_seguidor
    ADD CONSTRAINT usuario_seguidor_id_seguidor_fkey FOREIGN KEY (id_seguidor) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5042 (class 2606 OID 17127)
-- Name: usuario_seguidor usuario_seguidor_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_seguidor
    ADD CONSTRAINT usuario_seguidor_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5036 (class 2606 OID 17103)
-- Name: voto voto_id_imagen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto
    ADD CONSTRAINT voto_id_imagen_fkey FOREIGN KEY (id_imagen) REFERENCES public.imagen(id_imagen) ON UPDATE CASCADE;


--
-- TOC entry 5037 (class 2606 OID 17094)
-- Name: voto voto_id_votante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto
    ADD CONSTRAINT voto_id_votante_fkey FOREIGN KEY (id_votante) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE;


-- Completed on 2026-06-03 08:13:11

--
-- PostgreSQL database dump complete
--

\unrestrict mplW8BimAiE5jQjjXw6e1TElMNlUbuisVn0MXIHbSbnVNayZSgODluU68zbH3z1

