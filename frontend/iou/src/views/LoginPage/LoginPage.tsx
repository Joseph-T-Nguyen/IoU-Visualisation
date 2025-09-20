import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateEmail, validateRequired } from "@/lib/utils";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    email: false,
    password: false,
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
      error = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (field === 'email' && !validateEmail(value)) {
      error = 'Please enter a valid email address';
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: "",
      password: "",
    };

    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      const fieldKey = field as keyof FormData;
      const value = formData[fieldKey];
      
      if (!validateRequired(value)) {
        newErrors[fieldKey] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      } else if (fieldKey === 'email' && !validateEmail(value)) {
        newErrors[fieldKey] = 'Please enter a valid email address';
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
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
          <CardTitle className="text-center -mt-1">Log in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 -mt-3 p-0">
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

            <Button 
              type="submit" 
              className="w-full rounded-sm"
              disabled={Object.values(errors).some(error => error !== "") || Object.values(formData).some(value => value === "")}
            >
              Log in
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-22 w-[400px] text-sm">
        <span className="text-muted-foreground cursor-pointer">Create an Account</span>
        <span className="text-muted-foreground cursor-pointer">Forgot Password?</span>
      </div>
    </div>
  );
}