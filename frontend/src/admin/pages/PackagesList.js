import React, { useState, useEffect } from 'react';
import './PackagesList.scss';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import FormModal from '../components/FormModal';
import ImageUploader from '../components/ImageUploader';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import api from '../../utils/api';
import { Plus, Package, MapPin, ChevronDown, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'jeep',
    route: '',
    description: '',
    price: 0,
    items: [''],
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Fetch packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/packages');
      setPackages(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      setError('Gagal memuat data paket. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
    setPreviewImage(file);
  };
  
  // Handle package items
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };
  
  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };
  
  const handleItemChange = (index, value) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };
  
  // Handle add package
  const handleAddClick = () => {
    setFormData({
      name: '',
      type: 'jeep',
      route: '',
      description: '',
      price: 0,
      items: [''],
      image: null
    });
    setPreviewImage(null);
    setIsAddModalOpen(true);
  };
  
  const handleAddSubmit = async () => {
    if (!formData.name || !formData.image || formData.price <= 0) {
      setError('Nama, gambar, dan harga harus diisi dengan benar');
      return;
    }
    
    if (formData.type === 'jeep' && !formData.route) {
      setError('Rute harus diisi untuk paket jeep');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('route', formData.route || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      
      // Filter out empty items
      const filteredItems = formData.items.filter(item => item.trim() !== '');
      formDataToSend.append('items', JSON.stringify(filteredItems));
      
      formDataToSend.append('image', formData.image);
      
      await api.post('/packages', formDataToSend);
      
      setIsAddModalOpen(false);
      fetchPackages();
      setError(null);
    } catch (error) {
      console.error('Failed to add package:', error);
      setError('Gagal menambahkan paket. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle edit package
  const handleEditClick = (packageData) => {
    setCurrentPackage(packageData);
    
    // Transform package items array
    const packageItems = packageData.items?.map(item => item.item_name) || [''];
    
    setFormData({
      name: packageData.name,
      type: packageData.type,
      route: packageData.route || '',
      description: packageData.description || '',
      price: packageData.price,
      items: packageItems.length > 0 ? packageItems : [''],
      image: null
    });
    
    setPreviewImage(packageData.image_url);
    setIsEditModalOpen(true);
  };
  
  const handleEditSubmit = async () => {
    if (!formData.name || formData.price <= 0) {
      setError('Nama dan harga harus diisi dengan benar');
      return;
    }
    
    if (formData.type === 'jeep' && !formData.route) {
      setError('Rute harus diisi untuk paket jeep');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('route', formData.route || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      
      // Filter out empty items
      const filteredItems = formData.items.filter(item => item.trim() !== '');
      formDataToSend.append('items', JSON.stringify(filteredItems));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await api.put(`/packages/${currentPackage.id}`, formDataToSend);
      
      setIsEditModalOpen(false);
      fetchPackages();
      setError(null);
    } catch (error) {
      console.error('Failed to update package:', error);
      setError('Gagal mengupdate paket. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle delete package
  const handleDeleteClick = (packageData) => {
    setCurrentPackage(packageData);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      
      await api.delete(`/packages/${currentPackage.id}`);
      
      setIsDeleteModalOpen(false);
      fetchPackages();
    } catch (error) {
      console.error('Failed to delete package:', error);
      setError('Gagal menghapus paket. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle view package
  const handleViewClick = (packageData) => {
    setCurrentPackage(packageData);
    setIsViewModalOpen(true);
  };
  
  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'image_url',
      label: 'Gambar',
      render: (row) => (
        <div className="package-image">
          <img 
            src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${row.image_url}`} 
            alt={row.name}
          />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Nama',
      sortable: true
    },
    {
      key: 'type',
      label: 'Tipe',
      sortable: true,
      render: (row) => (
        <span className={`package-type ${row.type}`}>
          {row.type === 'jeep' ? 'Jeep' : 'Petik Jeruk'}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Harga',
      sortable: true,
      render: (row) => formatCurrency(row.price)
    },
    {
      key: 'items',
      label: 'Isi Paket',
      render: (row) => (
        <div className="package-items">
          {row.items && row.items.length > 0 ? (
            <span>{row.items.length} item</span>
          ) : (
            <span className="no-items">Tidak ada item</span>
          )}
        </div>
      )
    }
  ];
  
  // Action column
  const renderActions = (row, setMessage) => (
    <ActionMenu
      onView={() => handleViewClick(row)}
      onEdit={() => handleEditClick(row)}
      onDelete={() => handleDeleteClick(row)}
    />
  );
  
  if (loading && packages.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="packages-list-page">
      <div className="page-actions">
        <button className="add-button" onClick={handleAddClick}>
          <Plus size={18} />
          <span>Tambah Paket</span>
        </button>
      </div>
      
      {error && (
        <Message 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      <DataTable
        columns={columns}
        data={packages}
        searchKey="name"
        actionColumn={renderActions}
        isLoading={loading}
        emptyMessage="Tidak ada paket tersedia."
      />
      
      {/* Add Package Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Paket"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="name">
            Nama <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">
            Tipe <span className="required">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="jeep">Paket Jeep</option>
            <option value="orange-picking">Paket Petik Jeruk</option>
          </select>
        </div>
        
        {formData.type === 'jeep' && (
          <div className="form-group">
            <label htmlFor="route">
              Rute <span className="required">*</span>
            </label>
            <input
              type="text"
              id="route"
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              required={formData.type === 'jeep'}
              placeholder="Contoh: Kaliurang - Merapi - Kaliadem"
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Deskripsi paket..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">
            Harga <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="1000"
          />
          <p className="help-text">Harga dalam Rupiah (contoh: 350000)</p>
        </div>
        
        <div className="form-group">
          <label>
            Isi Paket <button type="button" className="add-item-button" onClick={handleAddItem}>
              <Plus size={14} /> Tambah Item
            </button>
          </label>
          
          <div className="package-items-container">
            {formData.items.map((item, index) => (
              <div key={index} className="package-item-input">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder="Nama item"
                />
                {formData.items.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-item-button"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="help-text">Tambahkan item yang termasuk dalam paket (contoh: Driver, Jeep, Air Mineral)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Paket"
          required={true}
        />
      </FormModal>
      
      {/* Edit Package Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Paket"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="name">
            Nama <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">
            Tipe <span className="required">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="jeep">Paket Jeep</option>
            <option value="orange-picking">Paket Petik Jeruk</option>
          </select>
        </div>
        
        {formData.type === 'jeep' && (
          <div className="form-group">
            <label htmlFor="route">
              Rute <span className="required">*</span>
            </label>
            <input
              type="text"
              id="route"
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              required={formData.type === 'jeep'}
              placeholder="Contoh: Kaliurang - Merapi - Kaliadem"
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Deskripsi paket..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">
            Harga <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="1000"
          />
          <p className="help-text">Harga dalam Rupiah (contoh: 350000)</p>
        </div>
        
        <div className="form-group">
          <label>
            Isi Paket <button type="button" className="add-item-button" onClick={handleAddItem}>
              <Plus size={14} /> Tambah Item
            </button>
          </label>
          
          <div className="package-items-container">
            {formData.items.map((item, index) => (
              <div key={index} className="package-item-input">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder="Nama item"
                />
                {formData.items.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-item-button"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="help-text">Tambahkan item yang termasuk dalam paket (contoh: Driver, Jeep, Air Mineral)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Paket"
          helpText="Biarkan kosong jika tidak ingin mengubah gambar."
        />
      </FormModal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Paket"
        message={`Apakah Anda yakin ingin menghapus paket "${currentPackage?.name}"?`}
        confirmText="Hapus"
        isLoading={formLoading}
      />
      
      {/* View Package Modal */}
      {currentPackage && (
        <FormModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onSubmit={() => setIsViewModalOpen(false)}
          title="Detail Paket"
          submitText="Tutup"
        >
          <div className="package-detail">
            <div className="detail-image">
              <img 
                src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${currentPackage.image_url}`} 
                alt={currentPackage.name} 
              />
            </div>
            
            <div className="detail-info">
              <div className="info-item">
                <h4>Nama</h4>
                <p>{currentPackage.name}</p>
              </div>
              
              <div className="info-item">
                <h4>Tipe</h4>
                <p className={`package-type ${currentPackage.type}`}>
                  {currentPackage.type === 'jeep' ? 'Paket Jeep' : 'Paket Petik Jeruk'}
                </p>
              </div>
              
              {currentPackage.type === 'jeep' && currentPackage.route && (
                <div className="info-item">
                  <h4>Rute</h4>
                  <p className="route">
                    <MapPin size={16} /> {currentPackage.route}
                  </p>
                </div>
              )}
              
              <div className="info-item">
                <h4>Deskripsi</h4>
                <p>{currentPackage.description || 'Tidak ada deskripsi'}</p>
              </div>
              
              <div className="info-item">
                <h4>Harga</h4>
                <p className="price">{formatCurrency(currentPackage.price)}</p>
              </div>
              
              <div className="info-item">
                <h4>Isi Paket</h4>
                {currentPackage.items && currentPackage.items.length > 0 ? (
                  <ul className="items-list">
                    {currentPackage.items.map((item, index) => (
                      <li key={index}>{item.item_name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">Tidak ada item</p>
                )}
              </div>
              
              <div className="info-item">
                <h4>Tanggal Dibuat</h4>
                <p>{new Date(currentPackage.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
              
              <div className="info-item">
                <h4>Terakhir Diupdate</h4>
                <p>{new Date(currentPackage.updatedAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default PackagesList;