'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  BookOpen, 
  Upload, 
  X, 
  Plus, 
  Save, 
  Eye,
  DollarSign,
  Clock,
  Users,
  Tag,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface CourseFormData {
  title: string;
  description: string;
  coverImage: File | null;
  images: File[];
  price: number;
  duration: number;
  maxStudents: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  coachId: string;
}

export default function CoursePublishForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  
  const coverImageRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    coverImage: null,
    images: [],
    price: 0,
    duration: 0,
    maxStudents: 0,
    level: 'beginner',
    category: '',
    tags: [],
    coachId: '',
  });

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      // 创建预览
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 这里应该调用API发布课程
      console.log('发布课程:', formData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 重定向到课程列表
      router.push('/institution/courses');
    } catch (err) {
      setError('发布课程失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 保存为草稿
      console.log('保存草稿:', formData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 重定向到课程列表
      router.push('/institution/courses');
    } catch (err) {
      setError('保存草稿失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">发布新课程</h1>
            <p className="text-gray-600">创建并发布您的课程内容</p>
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
              
              {/* 课程标题 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  课程标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入课程标题"
                  required
                />
              </div>

              {/* 课程描述 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  课程描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请详细描述课程内容、学习目标等"
                  required
                />
              </div>

              {/* 课程分类 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  课程分类 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">请选择分类</option>
                  <option value="programming">编程开发</option>
                  <option value="design">设计创意</option>
                  <option value="business">商业管理</option>
                  <option value="language">语言学习</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>

            {/* 课程设置 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程设置</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 价格 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    价格 (NZD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    required
                  />
                </div>

                {/* 时长 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    时长 (分钟) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="60"
                    required
                  />
                </div>

                {/* 最大学员数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    最大学员数 *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange('maxStudents', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="20"
                    required
                  />
                </div>
              </div>

              {/* 难度等级 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  难度等级 *
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'beginner', label: '初级', color: 'green' },
                    { value: 'intermediate', label: '中级', color: 'yellow' },
                    { value: 'advanced', label: '高级', color: 'red' }
                  ].map((level) => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        value={level.value}
                        checked={formData.level === level.value}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="mr-2"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        level.value === 'beginner' ? 'bg-green-100 text-green-800' :
                        level.value === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {level.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 课程图片 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程图片</h3>
              
              {/* 封面图片 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  封面图片 *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="封面预览"
                        className="mx-auto h-48 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview(null);
                          setFormData(prev => ({ ...prev, coverImage: null }));
                          if (coverImageRef.current) coverImageRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => coverImageRef.current?.click()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          上传封面图片
                        </button>
                        <input
                          ref={coverImageRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          className="hidden"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        建议尺寸：1200x630px，支持 JPG、PNG 格式
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 课程图片 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  课程图片 (可选)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {previewImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`课程图片 ${index + 1}`}
                            className="h-32 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => imagesRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加课程图片
                    </button>
                    <input
                      ref={imagesRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    最多可上传 10 张图片，支持 JPG、PNG 格式
                  </p>
                </div>
              </div>
            </div>

            {/* 课程标签 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程标签</h3>
              
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入标签后按回车添加"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 inline mr-2" />
              保存草稿
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  发布中...
                </div>
              ) : (
                <>
                  <Eye className="w-4 h-4 inline mr-2" />
                  发布课程
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
