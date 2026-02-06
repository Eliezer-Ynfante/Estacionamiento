import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';
import {
  LogOut,
  Plus,
  History,
  Trash2,
  Car,
  Mail,
  Calendar
} from 'lucide-react';

import {
  obtenerMisVehiculos,
  crearVehiculo,
  eliminarVehiculo
} from '@api/vehiculos';

import { obtenerMisReservas } from '../../api/reservar';

export default function DashboardView() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [vehiculos, setVehiculos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);

  const [formVehiculo, setFormVehiculo] = useState({
    placa: '',
    marca: '',
    color: ''
  });

  const [showFormVehiculo, setShowFormVehiculo] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  /* ================= DATA ================= */

  useEffect(() => {
    if (activeTab !== 'vehicles') return;

    (async () => {
      setLoadingVehiculos(true);
      try {
        const data = await obtenerMisVehiculos();
        const vehiculosArray = data.data || data.vehiculos || data;
        setVehiculos(Array.isArray(vehiculosArray) ? vehiculosArray : []);
      } finally {
        setLoadingVehiculos(false);
      }
    })();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'reservations') return;

    (async () => {
      setLoadingReservas(true);
      try {
        const data = await obtenerMisReservas();
        const reservasArray = data.data || data.reservas || data;
        setReservas(Array.isArray(reservasArray) ? reservasArray : []);
      } finally {
        setLoadingReservas(false);
      }
    })();
  }, [activeTab]);

  /* ================= ACTIONS ================= */

  const handleAgregarVehiculo = async (e) => {
    e.preventDefault();
    setErrorForm('');
    setLoadingForm(true);

    try {
      if (!formVehiculo.placa.trim())
        throw new Error('La placa es obligatoria');

      await crearVehiculo({
        tipo_vehiculo_id: 1,
        placa: formVehiculo.placa.toUpperCase(),
        marca: formVehiculo.marca || null,
        color: formVehiculo.color || null
      });

      const data = await obtenerMisVehiculos();
      const vehiculosArray = data.data || data.vehiculos || data;
      setVehiculos(Array.isArray(vehiculosArray) ? vehiculosArray : []);
      setFormVehiculo({ placa: '', marca: '', color: '' });
      setShowFormVehiculo(false);
    } catch {
      setErrorForm('Error al agregar vehículo');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleEliminarVehiculo = async (id) => {
    if (!window.confirm('¿Eliminar vehículo?')) return;

    await eliminarVehiculo(id);
    const data = await obtenerMisVehiculos();
    const vehiculosArray = data.data || data.vehiculos || data;
    setVehiculos(Array.isArray(vehiculosArray) ? vehiculosArray : []);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mi Panel</h1>
            <p className="text-sm text-gray-400">
              Bienvenido, {user?.nombre}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2 font-semibold hover:brightness-110 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="mx-auto max-w-6xl px-6 mt-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {[
            { id: 'profile', label: 'Perfil' },
            { id: 'vehicles', label: 'Vehículos' },
            { id: 'reservations', label: 'Reservas' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                ${activeTab === tab.id
                  ? 'bg-orange-700'
                  : 'text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Información Personal">
              <Field label="Nombre" value={user?.nombre} />
              <Field label="Email" value={user?.correo_electronico} icon={<Mail size={16} />} />
            </Card>

            <Card title="Seguridad">
              <button className="w-full rounded-lg bg-orange-700 py-3 font-semibold hover:brightness-110 transition">
                Cambiar contraseña
              </button>
            </Card>
          </div>
        )}

        {/* VEHICLES */}
        {activeTab === 'vehicles' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Mis Vehículos</h2>
              <button
                onClick={() => setShowFormVehiculo(!showFormVehiculo)}
                className="flex items-center gap-2 bg-orange-700 px-4 py-2 rounded-lg font-semibold"
              >
                <Plus size={18} />
                Agregar
              </button>
            </div>

            {showFormVehiculo && (
              <Card title="Nuevo Vehículo">
                {errorForm && (
                  <p className="mb-3 text-sm text-red-400">{errorForm}</p>
                )}
                <form onSubmit={handleAgregarVehiculo} className="grid md:grid-cols-3 gap-4">
                  <Input placeholder="Placa *" value={formVehiculo.placa} onChange={e => setFormVehiculo({ ...formVehiculo, placa: e.target.value })} />
                  <Input placeholder="Marca" value={formVehiculo.marca} onChange={e => setFormVehiculo({ ...formVehiculo, marca: e.target.value })} />
                  <Input placeholder="Color" value={formVehiculo.color} onChange={e => setFormVehiculo({ ...formVehiculo, color: e.target.value })} />

                  <div className="md:col-span-3 flex gap-3 mt-2">
                    <PrimaryButton loading={loadingForm} text="Agregar vehículo" />
                    <SecondaryButton onClick={() => setShowFormVehiculo(false)} text="Cancelar" />
                  </div>
                </form>
              </Card>
            )}

            {loadingVehiculos ? (
              <Loading />
            ) : vehiculos.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {vehiculos.map(v => (
                  <div key={v.id} className="rounded-xl bg-white/5 p-4 flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Car className="text-orange-700" />
                      <div>
                        <p className="font-semibold">{v.placa}</p>
                        <p className="text-sm text-gray-400">
                          {v.marca} {v.color && `- ${v.color}`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleEliminarVehiculo(v.id)}>
                      <Trash2 className="text-red-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon={<Car size={40} />}
                text="No tienes vehículos registrados"
                action="Registrar vehículo"
                onClick={() => setShowFormVehiculo(true)}
              />
            )}
          </>
        )}

        {/* RESERVATIONS */}
        {activeTab === 'reservations' && (
          <>
            <h2 className="text-xl font-bold mb-6">Historial de Reservas</h2>

            {loadingReservas ? (
              <Loading />
            ) : reservas.length ? (
              <div className="space-y-4">
                {reservas.map(r => (
                  <div key={r.id} className="rounded-xl bg-white/5 p-6 border border-white/10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={18} className="text-orange-700" />
                          <span className="font-bold text-lg">{r.codigo}</span>
                        </div>
                        <p className="text-xs text-gray-500">Creado: {new Date(r.fecha_creacion).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          r.estado === 'confirmada' ? 'bg-green-700' : 
                          r.estado === 'pendiente' ? 'bg-orange-700' : 
                          'bg-red-700'
                        }`}>
                          {r.estado}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          r.pago?.estado === 'pagado' ? 'bg-green-700' :
                          r.pago?.estado === 'pendiente' ? 'bg-yellow-700' :
                          'bg-gray-700'
                        }`}>
                          {r.pago?.estado || 'Sin pago'}
                        </span>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="mb-5 pb-5 border-b border-white/10">
                      <p className="text-xs text-gray-400 mb-1">FECHAS</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Inicio</p>
                          <p className="font-semibold">
                            {new Date(r.fecha_hora_inicio).toLocaleDateString('es-ES')} {new Date(r.fecha_hora_inicio).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Fin</p>
                          <p className="font-semibold">
                            {new Date(r.fecha_hora_fin).toLocaleDateString('es-ES')} {new Date(r.fecha_hora_fin).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detalles de Vehículo y Plaza */}
                    <div className="grid md:grid-cols-2 gap-4 mb-5 pb-5 border-b border-white/10">
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-semibold">VEHÍCULO</p>
                        <div className="bg-black/20 rounded-lg p-3">
                          <p className="font-bold text-orange-700 text-lg">{r.vehiculo?.placa}</p>
                          <p className="text-sm text-gray-400">{r.vehiculo?.marca} • {r.vehiculo?.color}</p>
                          <p className="text-xs text-gray-500">Año: {r.vehiculo?.año} • Tipo: {r.vehiculo?.tipo?.nombre}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-semibold">PLAZA</p>
                        <div className="bg-black/20 rounded-lg p-3">
                          <p className="font-bold text-lg">{r.plaza?.codigo}</p>
                        </div>
                      </div>
                    </div>

                    {/* Servicio y Pago */}
                    <div className="grid md:grid-cols-2 gap-4 mb-5 pb-5 border-b border-white/10">
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-semibold">SERVICIO</p>
                        <div className="bg-black/20 rounded-lg p-3">
                          <p className="font-semibold">{r.servicio?.nombre}</p>
                          <p className="text-sm text-orange-700">S/ {parseFloat(r.servicio?.precio || 0).toFixed(2)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-semibold">PAGO</p>
                        <div className="bg-black/20 rounded-lg p-3">
                          <p className="font-semibold text-lg">S/ {parseFloat(r.pago?.monto || 0).toFixed(2)}</p>
                          <p className="text-sm text-gray-400">Método: {r.pago?.metodo_pago || 'N/A'}</p>
                          {r.pago?.fecha_pago && <p className="text-xs text-gray-500">Pagado: {new Date(r.pago.fecha_pago).toLocaleDateString('es-ES')}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Total de la reserva:</p>
                      <p className="text-2xl font-bold text-orange-700">S/ {parseFloat(r.monto_total || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon={<History size={40} />}
                text="No tienes reservas"
                action="Hacer una reserva"
                onClick={() => navigate('/reservar')}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const Card = ({ title, children }) => (
  <div className="rounded-2xl bg-white/5 p-6">
    <h3 className="mb-4 font-semibold">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value, icon }) => (
  <div className="mb-4">
    <label className="text-sm text-gray-400">{label}</label>
    <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2 mt-1">
      {icon}
      <input value={value} disabled className="bg-transparent outline-none text-white w-full" />
    </div>
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="rounded-lg bg-black/40 px-4 py-3 outline-none border border-white/10 focus:border-orange-700"
  />
);

const PrimaryButton = ({ loading, text }) => (
  <button
    disabled={loading}
    className="rounded-lg bg-orange-700 px-6 py-3 font-semibold hover:brightness-110 disabled:opacity-50"
  >
    {loading ? 'Procesando...' : text}
  </button>
);

const SecondaryButton = ({ onClick, text }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border border-white/20 px-6 py-3"
  >
    {text}
  </button>
);

const Loading = () => (
  <p className="text-center text-gray-400 mt-10">Cargando...</p>
);

const Empty = ({ icon, text, action, onClick }) => (
  <div className="mt-10 text-center text-gray-400">
    <div className="mx-auto mb-4 text-orange-700">{icon}</div>
    <p className="mb-4">{text}</p>
    <button
      onClick={onClick}
      className="rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white"
    >
      {action}
    </button>
  </div>
);
