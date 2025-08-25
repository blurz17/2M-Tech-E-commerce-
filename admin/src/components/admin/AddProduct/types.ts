export interface ProductFormData {
  name: string;
  categories: string[];
  subcategories: string[];
  brand: string;
  description: string;
  stock: number;
  price: number;
  discount: number; // Added discount field
}

export interface Category {
  _id: string;
  name: string;
  value: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  value: string;
  parentCategory: {
    _id: string;
    name: string;
  };
}

export interface Brand {
  _id: string;
  name: string;
}

export interface ProductFormProps {
  formData: ProductFormData;
  categories: Category[];
  subcategories: Subcategory[];
  brands: Brand[];
  photoPreviews: string[];
  isLoading: boolean;
  categoriesLoading: boolean;
  subcategoriesLoading: boolean;
  brandsLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (selectedCategories: string[]) => void;
  onSubcategoryChange: (selectedSubcategories: string[]) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export interface PhotoGalleryProps {
  photoPreviews: string[];
  mainPhotoIndex: number;
  onSetAsMain: (index: number) => void;
  onRemovePhoto: (index: number) => void;
}

export interface MainPhotoDisplayProps {
  photoPreview: string;
}

