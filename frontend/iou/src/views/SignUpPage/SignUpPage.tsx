import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateEmail, validatePasswordMatch, validateRequired } from "@/lib/utils";

interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof FormData) => {
    const value = formData[field];
    let error = "";

    if (!validateRequired(value)) {
      error = `${field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (field === 'email' && !validateEmail(value)) {
      error = 'Please enter a valid email address';
    } else if (field === 'confirmPassword' && !validatePasswordMatch(formData.password, value)) {
      error = 'Passwords do not match';
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      const fieldKey = field as keyof FormData;
      const value = formData[fieldKey];
      
      if (!validateRequired(value)) {
        newErrors[fieldKey] = `${field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      } else if (fieldKey === 'email' && !validateEmail(value)) {
        newErrors[fieldKey] = 'Please enter a valid email address';
        isValid = false;
      } else if (fieldKey === 'confirmPassword' && !validatePasswordMatch(formData.password, value)) {
        newErrors[fieldKey] = 'Passwords do not match';
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, handle submission
      console.log("Form submitted:", formData);
      // TODO: Add actual submission logic when backend is ready
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
      <Card className="w-[400px] p-4 rounded-sm">
        <CardHeader>
          <CardTitle className="text-center -mt-1">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 -mt-2 p-0">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-3">
                <label className="w-30 text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={errors.email && touched.email ? "border-red-500" : ""}
                />
              </div>
              {errors.email && touched.email && (
                <span className="text-red-500 text-xs ml-32">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-3">
                <label className="w-30 text-sm font-medium">Username</label>
                <Input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  onBlur={() => handleBlur('username')}
                  className={errors.username && touched.username ? "border-red-500" : ""}
                />
              </div>
              {errors.username && touched.username && (
                <span className="text-red-500 text-xs ml-32">{errors.username}</span>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-3">
                <label className="w-30 text-sm font-medium">Password</label>
                <Input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={errors.password && touched.password ? "border-red-500" : ""}
                />
              </div>
              {errors.password && touched.password && (
                <span className="text-red-500 text-xs ml-32">{errors.password}</span>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-3">
                <label className="w-30 text-sm font-medium">Confirm Password</label>
                <Input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""}
                />
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="text-red-500 text-xs ml-32">{errors.confirmPassword}</span>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full mt-2 rounded-sm"
              disabled={Object.values(errors).some(error => error !== "") || Object.values(formData).some(value => value === "")}
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
      <span className="text-muted-foreground cursor-pointer">Log in</span>
    </div>
  );
}
