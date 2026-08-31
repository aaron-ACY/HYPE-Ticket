import React, { useState, useEffect } from "react";
import { User, Phone, Image, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

export const ProfileEditForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const avatarOptions = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  ];

  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(
    user?.avatar && !avatarOptions.includes(user.avatar) ? user.avatar : null
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Dung lượng ảnh tối đa là 5MB", "error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/hype/api/v1/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Tải ảnh lên thất bại");
      }

      setAvatar(data.url);
      setUploadedAvatar(data.url);
      showToast("Tải ảnh lên thành công!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Không thể tải ảnh lên", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Họ tên không được để trống", "error");
      return;
    }

    const cleanPhone = phone.trim().replace(/\s/g, "");
    if (!cleanPhone) {
      showToast("Số điện thoại không được để trống", "error");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      showToast("Số điện thoại phải gồm đúng 10 chữ số", "error");
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(name.trim(), cleanPhone, avatar);
      showToast("Cập nhật thông tin thành công!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Cập nhật thông tin thất bại", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-lg">
      <div className="space-y-4">
        {/* Name input */}
        <Input
          label="Họ và tên"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập họ tên đầy đủ"
          leftIcon={<User className="w-4 h-4 text-zinc-500" />}
        />

        {/* Phone input */}
        <Input
          label="Số điện thoại"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại liên hệ"
          leftIcon={<Phone className="w-4 h-4 text-zinc-500" />}
        />

        {/* Avatar option list */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 leading-none">
            <Image className="w-3.5 h-3.5 text-zinc-500" />
            Chọn hoặc tải ảnh đại diện
          </label>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Default Options */}
            {avatarOptions.map((url, index) => {
              const isSelected = avatar === url;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    isSelected ? "border-brand-primary scale-105" : "border-white/5 hover:border-white/15"
                  }`}
                >
                  <img src={url} alt={`Avatar option ${index + 1}`} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                      <div className="bg-brand-primary p-0.5 rounded-full text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Custom Uploaded Avatar */}
            {uploadedAvatar && (
              <button
                key="custom-avatar"
                type="button"
                onClick={() => setAvatar(uploadedAvatar)}
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                  avatar === uploadedAvatar ? "border-brand-primary scale-105" : "border-white/5 hover:border-white/15"
                }`}
              >
                <img src={uploadedAvatar} alt="Custom avatar" className="w-full h-full object-cover" />
                {avatar === uploadedAvatar && (
                  <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                    <div className="bg-brand-primary p-0.5 rounded-full text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                )}
              </button>
            )}

            {/* Custom Upload Button */}
            <label className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-dashed border-white/20 hover:border-brand-primary/60 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-zinc-400 text-lg font-semibold">+</span>
              )}
            </label>
          </div>
        </div>
      </div>

      <Button type="submit" variant="gradient" isLoading={isLoading} className="px-6 py-2.5">
        Lưu thay đổi
      </Button>
    </form>
  );
};
