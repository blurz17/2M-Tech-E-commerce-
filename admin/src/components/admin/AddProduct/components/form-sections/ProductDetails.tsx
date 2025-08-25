import React, { useMemo } from 'react';
import { ProductFormData } from '../../types';
import WysiwygEditor from '../../../../common/WysiwygEditor/WysiwygEditor';

interface ProductDetailsProps {
  formData: ProductFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onDescriptionChange: (value: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  formData,
  onInputChange,
  onDescriptionChange
}) => {
  // Calculate net price based on price and discount
  const netPrice = useMemo(() => {
    if (formData.price && formData.discount >= 0) {
      return formData.price - ((formData.price * formData.discount) / 100);
    }
    return formData.price;
  }, [formData.price, formData.discount]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-green-600 font-bold">2</span>
        </div>
        Product Details
      </h2>
      
      <div className="space-y-6">
        {/* WYSIWYG Description Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <WysiwygEditor
              value={formData.description}
              onChange={onDescriptionChange}
              placeholder="Describe your product features, benefits, and specifications in detail..."
              height={400}
              className="rounded-xl"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use the toolbar above to format your product description with headings, lists, links, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                min="0"
                placeholder="0"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                units
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Price (EGP) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onInputChange}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                EGP
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={onInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                %
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Optional: Enter discount percentage (0-100%)
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Net Price (EGP)
            </label>
            <div className="relative">
              <input
                type="text"
                value={netPrice.toFixed(2)}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                disabled
                readOnly
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                EGP
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Final price after discount (calculated automatically)
            </p>
          </div>
        </div>

        {/* Price Summary Card */}
        {(formData.price > 0 || formData.discount > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Original Price:</span>
                <span className="font-semibold text-gray-800">EGP {formData.price.toFixed(2)}</span>
              </div>
              {formData.discount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount ({formData.discount}%):</span>
                    <span className="font-semibold text-red-600">
                      -EGP {((formData.price * formData.discount) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-blue-300 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Final Price:</span>
                      <span className="text-lg font-bold text-green-600">EGP {netPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.discount === 0 && (
                <div className="text-sm text-gray-500 italic">No discount applied</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;