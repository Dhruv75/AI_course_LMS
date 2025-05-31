"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SparkleIcon } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddNewCourseDialog = ({ children }) => {
  // Move useRouter inside the component
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeVideo: false,
    noOfChapters: 1,
    category: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGenerate = async () => {
    setLoading(true);
    console.log("Generating course with data: ", formData);
    const result = await axios.post("/api/generate-course-layout", {
      ...formData,
    });

    console.log("Generated Course Data: ", result.data);
    setLoading(false);
    router.push(`/workspace/edit-course/${result.data.cid}`);
  };

  React.useEffect(() => {
    console.log("Form Data Updated: ", formData);
  }, [formData]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Course using AI</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-4 mt-3">
              <div>
                <label
                  htmlFor="courseName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Name
                </label>
                <Input
                  id="courseName"
                  placeholder="Course Name"
                  value={formData.name}
                  onChange={(event) =>
                    onHandleInputChange("name", event.target.value)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="courseDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Description (optional)
                </label>
                <Textarea
                  id="courseDescription"
                  placeholder="Write description of the course you want to generate"
                  value={formData.description}
                  onChange={(event) =>
                    onHandleInputChange("description", event.target.value)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="numChapters"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No. of chapters
                </label>
                <Input
                  id="numChapters"
                  placeholder="Write no of chapters you want to generate"
                  type="number"
                  min="1"
                  value={formData.noOfChapters}
                  onChange={(event) =>
                    onHandleInputChange(
                      "noOfChapters",
                      parseInt(event.target.value) || 1
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor="includeVideo"
                  className="text-sm font-medium text-gray-700"
                >
                  Include Video ?
                </label>
                <Switch
                  id="includeVideo"
                  checked={formData.includeVideo}
                  onCheckedChange={(checked) =>
                    onHandleInputChange("includeVideo", checked)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="difficultyLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Difficulty Level
                </label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => onHandleInputChange("level", value)}
                >
                  <SelectTrigger className="w-full" id="difficultyLevel">
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category (separated by comma)
                </label>
                <Input
                  id="category"
                  placeholder="tech, maths, etc"
                  value={formData.category}
                  onChange={(event) =>
                    onHandleInputChange("category", event.target.value)
                  }
                />
              </div>

              <Button
                className="w-full mt-4"
                onClick={onGenerate}
                disabled={loading}
              >
                {loading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SparkleIcon className="mr-2 h-4 w-4" />
                )}
                Generate Course
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCourseDialog;