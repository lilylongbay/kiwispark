'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Upload, 
  X, 
  Plus, 
  Save, 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  Star,
  Calendar
} from 'lucide-react';

interface CoachFormData {
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  bio: string;
  avatar: File | null;
  specialties: string[];
  experience: number;
  education: string[];
  certifications: string[];
  hourlyRate: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export default function CoachManagementForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [educationInput, setEducationInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  
  const avatarRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CoachFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    bio: '',
    avatar: null,
    specialties: [],
    experience: 0,
    education: [],
    certifications: [],
    hourlyRate: 0,
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });

  const handleInputChange = (field: keyof CoachFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: checked
      }
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()]
      }));
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (specialtyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(specialty => specialty !== specialtyToRemove)
    }));
  };

  const addEducation = () => {
    if (educationInput.trim() && !formData.education.includes(educationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, educationInput.trim()]
      }));
      setEducationInput('');
    }
  };

  const removeEducation = (educationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(education => education !== educationToRemove)
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim() && !formData.certifications.includes(certificationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput('');
    }
  };

  const removeCertification = (certificationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(certification => certification !== certificationToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 这里应该调用API创建教练
      console.log('创建教练:', formData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 重定向到教练列表
      router.push('/institution/coaches');
    } catch (err) {
      setError('创建教练失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const days = [
    { key: 'monday', label: '周一' },
    { key: 'tuesday', label: '周二' },
    { key: 'wednesday', label: '周三' },
    { key: 'thursday', label: '周四' },
    { key: 'friday', label: '周五' },
    { key: 'saturday', label: '周六' },
    { key: 'sunday', label: '周日' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">添加新教练</h1>
            <p className="text-gray-600">邀请教练加入您的教育机构</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 姓名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="请输入教练姓名"
                    required
                  />
                </div>

                {/* 邮箱 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    邮箱 *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="请输入邮箱地址"
                    required
                  />
                </div>

                {/* 电话 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    电话 *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="请输入电话号码"
                    required
                  />
                </div>

                {/* 位置 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    位置 *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="请输入所在城市"
                    required
                  />
                </div>
              </div>

              {/* 个人简介 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个人简介 *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="请介绍教练的背景、教学经验等"
                  required
                />
              </div>
            </div>

            {/* 头像上传 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">头像</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {avatarPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={avatarPreview}
                      alt="头像预览"
                      className="h-32 w-32 object-cover rounded-full mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(null);
                        setFormData(prev => ({ ...prev, avatar: null }));
                        if (avatarRef.current) avatarRef.current.value = '';
                      }}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => avatarRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        上传头像
                      </button>
                      <input
                        ref={avatarRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      建议尺寸：400x400px，支持 JPG、PNG 格式
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 专业信息 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">专业信息</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 教学经验 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    教学经验 (年) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0"
                    required
                  />
                </div>

                {/* 时薪 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    时薪 (NZD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* 专业领域 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  专业领域 *
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="输入专业领域后按回车添加"
                  />
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(specialty)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 教育背景 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">教育背景</h3>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={educationInput}
                  onChange={(e) => setEducationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="输入教育背景后按回车添加"
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.education.length > 0 && (
                <div className="space-y-2">
                  {formData.education.map((education, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{education}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(education)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 认证证书 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">认证证书</h3>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="输入认证证书后按回车添加"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.certifications.length > 0 && (
                <div className="space-y-2">
                  {formData.certifications.map((certification, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{certification}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertification(certification)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 可用时间 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">可用时间</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {days.map((day) => (
                  <label key={day.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availability[day.key as keyof typeof formData.availability]}
                      onChange={(e) => handleAvailabilityChange(day.key, e.target.checked)}
                      className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  创建中...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 inline mr-2" />
                  创建教练
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
