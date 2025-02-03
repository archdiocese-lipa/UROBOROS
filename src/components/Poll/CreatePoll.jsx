import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectedDate from "./SelectedDate"; // Import the SelectedDate component
import useCreatePoll from "@/hooks/Poll/useCreatePoll"; // Import the useCreatePoll hook

const CreatePoll = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [pollData, setPollData] = useState({
    pollName: "",
    pollDescription: "",
    dates: [],
  });
  const [entries, setEntries] = useState({});
  const [errors, setErrors] = useState({});

  const form = useForm({
    defaultValues: {
      pollName: "",
      pollDescription: "",
    },
  });

  const createPollMutation = useCreatePoll({
    onSuccess: () => setOpenDialog(false),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPollData({ ...pollData, [name]: value });
    form.setValue(name, value); // Ensure form state is updated
  };

  const handleDateChange = (date) => {
    if (date) {
      setPollData((prevState) => {
        const dates = prevState.dates.includes(date)
          ? prevState.dates.filter((d) => d.getTime() !== date.getTime())
          : [...prevState.dates, date];
        return { ...prevState, dates };
      });

      setEntries((prevEntries) => {
        if (prevEntries[date.toLocaleDateString()]) {
          const { [date.toLocaleDateString()]: _, ...rest } = prevEntries;
          return rest;
        } else {
          return { ...prevEntries, [date.toLocaleDateString()]: [] };
        }
      });
    }
  };

  const handleTimeChange = (date, times) => {
    setEntries((prevEntries) => ({
      ...prevEntries,
      [date]: times.map((time) => time.time),
    }));
  };

  const handleRemoveEntry = (date) => {
    const parsedDate = new Date(date);
    setPollData((prevState) => ({
      ...prevState,
      dates: prevState.dates.filter(
        (d) => d.getTime() !== parsedDate.getTime()
      ),
    }));
    setEntries((prevEntries) => {
      const { [date]: _, ...rest } = prevEntries;
      return rest;
    });
  };

  const handleOpenChange = (isOpen) => {
    setOpenDialog(isOpen);
    if (isOpen) {
      form.reset({
        pollName: "",
        pollDescription: "",
      });
      setPollData({
        pollName: "",
        pollDescription: "",
        dates: [],
      });
      setEntries({});
      setPage(1);
    }
  };

  const validatePage1 = () => {
    const newErrors = {};
    if (pollData.pollName.trim() === "") {
      newErrors.pollName = "Poll Name is required";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors = {};
    if (pollData.dates.length === 0) {
      newErrors.dates = "At least one date is required";
    } else if (!Object.values(entries).every((times) => times.length > 0)) {
      newErrors.times = "Each selected date must have at least one time slot";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNextPage = () => {
    if (page === 1 && validatePage1()) {
      setPage(2);
    }
  };

  const onSubmit = (values) => {
    if (!validatePage2()) {
      return;
    }

    const pollDetails = {
      pollName: values.pollName,
      pollDescription: values.pollDescription,
    };

    const pollEntries = Object.keys(entries).flatMap((date) =>
      entries[date].map((time) => ({
        pollEntryDate: date,
        pollEntryTime: time,
      }))
    );

    createPollMutation.mutate({ pollData: pollDetails, pollEntries });
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-14 gap-x-2 rounded-xl text-lg font-medium">
          Create Poll
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-[500px] w-auto min-w-[900px] max-w-[95%] space-y-6 p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Poll</DialogTitle>
          <DialogDescription className="text-gray-600">
            Add details about your poll. This can be edited later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {page === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="pollName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        Poll Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter poll name"
                          {...field}
                          value={pollData.pollName}
                          onChange={handleInputChange}
                          className="focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      {errors.pollName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.pollName}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pollDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        Description{" "}
                        <span className="text-sm font-light italic">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Maximum of 128 characters"
                          {...field}
                          value={pollData.pollDescription}
                          onChange={handleInputChange}
                          className="resize-none focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={handleNextPage}
                    className="px-6 py-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            {page === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <DatePicker
                      selected={null}
                      onChange={handleDateChange}
                      inline
                      highlightDates={pollData.dates}
                      dayClassName={(date) => {
                        const isSelected = pollData.dates.some(
                          (d) => d.getTime() === date.getTime()
                        );
                        return isSelected ? "bg-light-brown" : "";
                      }}
                    />
                    {errors.dates && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.dates}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Selected Dates
                    </h3>
                    <div className="bg-gray-50 max-h-80 overflow-y-auto rounded p-4 shadow">
                      <ul className="space-y-4">
                        {Object.keys(entries).length === 0 ? (
                          <li className="text-gray-500">No dates selected</li>
                        ) : (
                          Object.keys(entries).map((date, index) => (
                            <li key={index}>
                              <SelectedDate
                                date={date}
                                onTimeChange={handleTimeChange}
                                onRemove={handleRemoveEntry}
                              />
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                    {errors.times && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.times}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setPage(1)}
                    className="px-6 py-2"
                  >
                    Back
                  </Button>
                  <div className="flex gap-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="px-6 py-2">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoll;
