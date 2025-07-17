import React, { useState, useEffect } from 'react';
import './PromotionsList.scss';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import FormModal from '../components/FormModal';
import ImageUploader from '../components/ImageUploader';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import api from '../../utils/api';
import { Plus, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const PromotionsList = () => {
  const [promotions, setPromotions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    terms: '',
    valid_from: '',
    valid_until: '',
    discount_percent: 10,
    package_ids: [],
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [promotionsRes, packagesRes] = await Promise.all([
        api.get('/promotions'),
        api.get('/packages')
      ]);
      
      setPromotions(promotionsRes.data);
      setPackages(packagesRes.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Set default dates for new promotion
  const getDefaultDates = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    return {
      valid_from: today.toISOString().split('T')[0],
      valid_until: nextMonth.toISOString().split('T')[0]
    };
  };
  
  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
    setPreviewImage(file);
  };
  
  const handlePackageChange = (e) => {
    const packageId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        package_ids: [...prev.package_ids, packageId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        package_ids: prev.package_ids.filter(id => id !== packageId)
      }));
    }
  };
  
  // Handle add promotion
  const handleAddClick = () => {
    const defaultDates = getDefaultDates();
    
    setFormData({
      title: '',
      description: '',
      terms: '',
      valid_from: defaultDates.valid_from,
      valid_until: defaultDates.valid_until,
      discount_percent: 10,
      package_ids: [],
      image: null
    });
    
    setPreviewImage(null);
    setIsAddModalOpen(true);
  };
  
  const handleAddSubmit = async () => {
    if (!formData.title || !formData.valid_from || !formData.valid_until || !formData.discount_percent) {
      setError('Judul, periode, dan persentase diskon harus diisi');
      return;
    }
    
    if (formData.package_ids.length === 0) {
      setError('Pilih minimal 1 paket untuk promo');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('terms', formData.terms || '');
      formDataToSend.append('valid_from', formData.valid_from);
      formDataToSend.append('valid_until', formData.valid_until);
      formDataToSend.append('discount_percent', formData.discount_percent);
      formDataToSend.append('package_ids', JSON.stringify(formData.package_ids));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await api.post('/promotions', formDataToSend);
      
      setIsAddModalOpen(false);
      fetchData();
      setError(null);
    } catch (error) {
      console.error('Failed to add promotion:', error);
      setError('Gagal menambahkan promo. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle edit promotion
  const handleEditClick = (promotion) => {
    setCurrentPromotion(promotion);
    
    // Get package IDs from promotion
    const packageIds = promotion.packages?.map(pkg => pkg.id) || [];
    
    setFormData({
      title: promotion.title,
      description: promotion.description || '',
      terms: promotion.terms || '',
      valid_from: new Date(promotion.valid_from).toISOString().split('T')[0],
      valid_until: new Date(promotion.valid_until).toISOString().split('T')[0],
      discount_percent: promotion.discount_percent,
      package_ids: packageIds,
      image: null
    });
    
    setPreviewImage(promotion.image_url);
    setIsEditModalOpen(true);
  };
  
  const handleEditSubmit = async () => {
    if (!formData.title || !formData.valid_from || !formData.valid_until || !formData.discount_percent) {
      setError('Judul, periode, dan persentase diskon harus diisi');
      return;
    }
    
    if (formData.package_ids.length === 0) {
      setError('Pilih minimal 1 paket untuk promo');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('terms', formData.terms || '');
      formDataToSend.append('valid_from', formData.valid_from);
      formDataToSend.append('valid_until', formData.valid_until);
      formDataToSend.append('discount_percent', formData.discount_percent);
      formDataToSend.append('package_ids', JSON.stringify(formData.package_ids));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await api.put(`/promotions/${currentPromotion.id}`, formDataToSend);
      
      setIsEditModalOpen(false);
      fetchData();
      setError(null);
    } catch (error) {
      console.error('Failed to update promotion:', error);
      setError('Gagal mengupdate promo. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle delete promotion
  const handleDeleteClick = (promotion) => {
    setCurrentPromotion(promotion);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      
      await api.delete(`/promotions/${currentPromotion.id}`);
      
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      setError('Gagal menghapus promo. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle view promotion
  const handleViewClick = (promotion) => {
    setCurrentPromotion(promotion);
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
      key: 'title',
      label: 'Judul',
      sortable: true
    },
    {
      key: 'discount_percent',
      label: 'Diskon',
      sortable: true,
      render: (row) => `${row.discount_percent}%`
    },
    {
      key: 'valid_from',
      label: 'Mulai',
      sortable: true,
      render: (row) => formatDate(row.valid_from)
    },
    {
      key: 'valid_until',
      label: 'Sampai',
      sortable: true,
      render: (row) => formatDate(row.valid_until)
    },
    {
      key: 'packages',
      label: 'Paket',
      render: (row) => (
        <div className="packages-cell">
          {row.packages && row.packages.length > 0 ? (
            <span>{row.packages.length} paket</span>
          ) : (
            <span className="no-packages">Tidak ada paket</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const now = new Date();
        const validUntil = new Date(row.valid_until);
        const isActive = validUntil >= now;
        
        return (
          <span className={`status-badge ${isActive ? 'active' : 'expired'}`}>
            {isActive ? 'Aktif' : 'Berakhir'}
          </span>
        );
      }
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
  
  if (loading && promotions.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="promotions-list-page">
      <div className="page-actions">
        <button className="add-button" onClick={handleAddClick}>
          <Plus size={18} />
          <span>Tambah Promo</span>
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
        data={promotions}
        searchKey="title"
        actionColumn={renderActions}
        isLoading={loading}
        emptyMessage="Tidak ada promo tersedia."
      />
      
      {/* Add Promotion Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Promo"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="title">
            Judul <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Deskripsi promo..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="terms">Syarat dan Ketentuan</label>
          <textarea
            id="terms"
            name="terms"
            value={formData.terms}
            onChange={handleInputChange}
            placeholder="Syarat dan ketentuan promo..."
          />
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="valid_from">
              Berlaku Dari <span className="required">*</span>
            </label>
            <input
              type="date"
              id="valid_from"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="valid_until">
              Sampai <span className="required">*</span>
            </label>
            <input
              type="date"
              id="valid_until"
              name="valid_until"
              value={formData.valid_until}
              onChange={handleInputChange}
              required
              min={formData.valid_from}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="discount_percent">
            Persentase Diskon <span className="required">*</span>
          </label>
          <div className="discount-input">
            <input
              type="number"
              id="discount_percent"
              name="discount_percent"
              value={formData.discount_percent}
              onChange={handleInputChange}
              required
              min="1"
              max="100"
            />
            <span className="percent-symbol">%</span>
          </div>
          <p className="help-text">Persentase diskon dari 1 sampai 100</p>
        </div>
        
        <div className="form-group">
          <label>
            Paket yang Dipromo <span className="required">*</span>
          </label>
          <div className="packages-checkbox-list">
            {packages.length > 0 ? (
              packages.map(pkg => (
                <div key={pkg.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`package-${pkg.id}`}
                    value={pkg.id}
                    checked={formData.package_ids.includes(pkg.id)}
                    onChange={handlePackageChange}
                  />
                  <label htmlFor={`package-${pkg.id}`}>
                    {pkg.name} - {formatCurrency(pkg.price)}
                  </label>
                </div>
              ))
            ) : (
              <p className="no-packages">Tidak ada paket tersedia</p>
            )}
          </div>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Promo"
          helpText="Opsional. Tambahkan gambar untuk promo."
        />
      </FormModal>
      
      {/* Edit Promotion Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Promo"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="title">
            Judul <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Deskripsi promo..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="terms">Syarat dan Ketentuan</label>
          <textarea
            id="terms"
            name="terms"
            value={formData.terms}
            onChange={handleInputChange}
            placeholder="Syarat dan ketentuan promo..."
          />
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="valid_from">
              Berlaku Dari <span className="required">*</span>
            </label>
            <input
              type="date"
              id="valid_from"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="valid_until">
              Sampai <span className="required">*</span>
            </label>
            <input
              type="date"
              id="valid_until"
              name="valid_until"
              value={formData.valid_until}
              onChange={handleInputChange}
              required
              min={formData.valid_from}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="discount_percent">
            Persentase Diskon <span className="required">*</span>
          </label>
          <div className="discount-input">
            <input
              type="number"
              id="discount_percent"
              name="discount_percent"
              value={formData.discount_percent}
              onChange={handleInputChange}
              required
              min="1"
              max="100"
            />
            <span className="percent-symbol">%</span>
          </div>
          <p className="help-text">Persentase diskon dari 1 sampai 100</p>
        </div>
        
        <div className="form-group">
          <label>
            Paket yang Dipromo <span className="required">*</span>
          </label>
          <div className="packages-checkbox-list">
            {packages.length > 0 ? (
              packages.map(pkg => (
                <div key={pkg.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`package-${pkg.id}`}
                    value={pkg.id}
                    checked={formData.package_ids.includes(pkg.id)}
                    onChange={handlePackageChange}
                  />
                  <label htmlFor={`package-${pkg.id}`}>
                    {pkg.name} - {formatCurrency(pkg.price)}
                  </label>
                </div>
              ))
            ) : (
              <p className="no-packages">Tidak ada paket tersedia</p>
            )}
          </div>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Promo"
          helpText="Biarkan kosong jika tidak ingin mengubah gambar."
        />
      </FormModal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Promo"
        message={`Apakah Anda yakin ingin menghapus promo "${currentPromotion?.title}"?`}
        confirmText="Hapus"
        isLoading={formLoading}
      />
      
      {/* View Promotion Modal */}
      {currentPromotion && (
        <FormModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onSubmit={() => setIsViewModalOpen(false)}
          title="Detail Promo"
          submitText="Tutup"
        >
          <div className="promotion-detail">
            {currentPromotion.image_url && (
              <div className="detail-image">
                <img 
                  src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${currentPromotion.image_url}`} 
                  alt={currentPromotion.title} 
                />
              </div>
            )}
            
            <div className="detail-info">
              <div className="info-item">
                <h4>Judul</h4>
                <p>{currentPromotion.title}</p>
              </div>
              
              <div className="info-item">
                <h4>Deskripsi</h4>
                <p>{currentPromotion.description || 'Tidak ada deskripsi'}</p>
              </div>
              
              <div className="info-item">
                <h4>Syarat dan Ketentuan</h4>
                <p>{currentPromotion.terms || 'Tidak ada syarat dan ketentuan'}</p>
              </div>
              
              <div className="info-item">
                <h4>Periode</h4>
                <p className="period">
                  <Calendar size={16} /> {formatDate(currentPromotion.valid_from)} - {formatDate(currentPromotion.valid_until)}
                </p>
              </div>
              
              <div className="info-item">
                <h4>Diskon</h4>
                <p className="discount">{currentPromotion.discount_percent}%</p>
              </div>
              
              <div className="info-item">
                <h4>Paket yang Dipromo</h4>
                {currentPromotion.packages && currentPromotion.packages.length > 0 ? (
                  <div className="packages-list">
                    {currentPromotion.packages.map(pkg => (
                      <div key={pkg.id} className="package-item">
                        <p className="package-name">{pkg.name}</p>
                        <div className="price-comparison">
                          <span className="original-price">{formatCurrency(pkg.price)}</span>
                          <span className="arrow">→</span>
                          <span className="discounted-price">
                            {formatCurrency(pkg.price - (pkg.price * currentPromotion.discount_percent / 100))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-packages">Tidak ada paket</p>
                )}
              </div>
              
              <div className="info-item">
                <h4>Status</h4>
                {(() => {
                  const now = new Date();
                  const validUntil = new Date(currentPromotion.valid_until);
                  const isActive = validUntil >= now;
                  
                  return (
                    <span className={`status-badge ${isActive ? 'active' : 'expired'}`}>
                      {isActive ? 'Aktif' : 'Berakhir'}
                    </span>
                  );
                })()}
              </div>
              
              <div className="info-item">
                <h4>Tanggal Dibuat</h4>
                <p>{new Date(currentPromotion.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
              
              <div className="info-item">
                <h4>Terakhir Diupdate</h4>
                <p>{new Date(currentPromotion.updatedAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default PromotionsList;