import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../index.css';
import kartik from '../assets/kartik.webp'
import Virat from '../assets/virat.jpg'


const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  React.useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 10, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

function Home() {
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'Kartik Aaryan',
      photo: kartik,
      description: 'Frontend Developer',
      location: { lat: 19.0760, lng: 72.8777 },
      city: 'Mumbai',
    },
    {
      id: 2,
      name: 'Virat Kohli',
      photo: Virat,
      description: 'Backend Engineer',
      location: { lat: 18.516726, lng: 73.856255 },
      city: 'pune',
    },
  ]);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', photo: '', description: '', city: '', lat: '', lng: '' });
  const [editId, setEditId] = useState(null);


  const handleAddProfile = () => {
    if (
      !formData.name ||
      !formData.photo ||
      !formData.description ||
      !formData.city ||
      !formData.lat ||
      !formData.lng
    ) {
      alert('Please fill all fields before adding a profile.');
      return;
    }

    const newProfile = {
      id: Date.now(),
      name: formData.name,
      photo: formData.photo,
      description: formData.description,
      city: formData.city,
      location: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
    };
    setProfiles([...profiles, newProfile]);
    setFormData({ name: '', photo: '', description: '', city: '', lat: '', lng: '' });
  };

  const handleDeleteProfile = (id) => {
    setProfiles(profiles.filter((p) => p.id !== id));
    if (selectedProfile && selectedProfile.id === id) {
      setSelectedProfile(null);
    }
  };

  const handleEditProfile = (profile) => {
    setEditId(profile.id);
    setFormData({
      name: profile.name,
      photo: profile.photo,
      description: profile.description,
      city: profile.city,
      lat: profile.location.lat,
      lng: profile.location.lng,
    });
  };

  const handleUpdateProfile = () => {
    if (
      !formData.name ||
      !formData.photo ||
      !formData.description ||
      !formData.city ||
      !formData.lat ||
      !formData.lng
    ) {
      alert('Please fill all fields before updating the profile.');
      return;
    }

    setProfiles(
      profiles.map((profile) =>
        profile.id === editId
          ? {
              ...profile,
              name: formData.name,
              photo: formData.photo,
              description: formData.description,
              city: formData.city,
              location: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
            }
          : profile
      )
    );
    setEditId(null);
    setFormData({ name: '', photo: '', description: '', city: '', lat: '', lng: '' });
  };

  const filteredProfiles = profiles.filter((profile) => {
    const term = searchTerm.toLowerCase();
    return (
      profile.name.toLowerCase().includes(term) ||
      profile.description.toLowerCase().includes(term) ||
      profile.city.toLowerCase().includes(term)
    );
  });

  return (
    <div className="app">
      <h1>Profile Directory</h1>
      <button onClick={() => setAdminMode(!adminMode)} className='btn'>
        {adminMode ? 'Switch to User View' : 'Switch to Admin View'}
      </button>

      {adminMode ? (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
          type='file'
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
          />
          <input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <input
            placeholder="Latitude"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
          />
          <input
            placeholder="Longitude"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
          />
          {editId ? (
            <button onClick={handleUpdateProfile}>Update Profile</button>
          ) : (
            <button onClick={handleAddProfile}>Add Profile</button>
          )}

          <div className="profile-grid">
            {profiles.map((profile) => (
              <div className="profile-card" key={profile.id}>
                <img src={profile.photo} alt={profile.name} className="profile-photo" />
                <h2>{profile.name}</h2>
                <p>{profile.description}</p>
                <p>
                  <strong>City:</strong> {profile.city}
                </p>
                <button onClick={() => handleEditProfile(profile)}>Edit</button>
                <button onClick={() => handleDeleteProfile(profile.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search by name, role, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="profile-grid">
            {filteredProfiles.map((profile) => (
              <div className="profile-card" key={profile.id}>
                <img src={profile.photo} alt={profile.name} className="profile-photo" />
                <h2>{profile.name}</h2>
                <p>{profile.description}</p>
                <p>
                  <strong>City:</strong> {profile.city}
                </p>
                <button className="summary-button" onClick={() => setSelectedProfile(profile)}>Summary</button>
              </div>
            ))}
          </div>

          {selectedProfile && (
            <div className="map-container">
              <h2>Location for {selectedProfile.name}</h2>
              {isNaN(selectedProfile.location.lat) || isNaN(selectedProfile.location.lng) ? (
                <div className="error-message">
                  Invalid coordinates. Unable to display map.
                </div>
              ) : (
                <MapContainer center={selectedProfile.location} zoom={10} style={{ height: '400px', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={selectedProfile.location} icon={defaultIcon}>
                    <Popup>
                      <strong>{selectedProfile.name}</strong>
                      <br />
                      {selectedProfile.description}
                      <br />
                      {selectedProfile.city}
                    </Popup>
                  </Marker>
                  <RecenterMap lat={selectedProfile.location.lat} lng={selectedProfile.location.lng} />
                </MapContainer>
              )}
            </div>
          )}

         
        </>
      )}
    </div>
  );
}

export default Home;
