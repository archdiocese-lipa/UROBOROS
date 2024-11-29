import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import PropTypes from "prop-types";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { useUser } from "@/context/useUser";
import {
  useChildrenManualAttendance,
  useGuardianManualAttendEvent,
  useMainApplicantAttendEvent,
} from "@/hooks/useManualAttendEvent";
import { useFamilyData } from "@/hooks/useFamilyData";
import { manualAttendEventsSchema } from "@/zodSchema/ManualAttendEventsSchema";
import { Checkbox } from "../ui/checkbox";

const QrScannerEvents = ({ eventData }) => {
  const [isValidQr, setIsValidQr] = useState(null); // if the qr code is valid
  const [isQrScanned, setIsQrScanned] = useState(false);
  const [selectedEvent, setselectedEvent] = useState("");

  const { userData } = useUser(); // Get the userId
  const userId = userData?.id;

  const { parentData, childData, isLoading, error } = useFamilyData(); // Fetch family data

  const form = useForm({
    resolver: zodResolver(manualAttendEventsSchema),
    defaultValues: {
      parents: [],
      children: [],
    },
  });

  const { mutate: mainApplicantAttend } = useMainApplicantAttendEvent();
  const { mutate: guardianManualAttend } = useGuardianManualAttendEvent();
  const { mutate: childrenManualAttend } = useChildrenManualAttendance();

  const onSubmit = (data) => {
    // Main applicant data (always included)
    const mainApplicant = [
      {
        attendee_id: userId,
        event_id: selectedEvent,
        attendee_type: "parents",
        attended: false,
        main_applicant: true,
      },
    ];
    // Guardian (parent) data, only map if there are parents selected
    const parentsData =
      data.parents?.map((parent) => ({
        ...parent,
        event_id: selectedEvent,
        attendee_type: "parents",
        attended: false,
        main_applicant: false,
      })) || [];

    const childrenData = data.children?.map((children) => ({
      ...children,
      event_id: selectedEvent,
      attendee_type: "children",
      attended: false,
      main_applicant: false,
    }));

    mainApplicantAttend(mainApplicant);
    guardianManualAttend(parentsData);
    childrenManualAttend(childrenData);
  };

  const handleGetQrResult = (result) => {
    if (result && Array.isArray(result)) {
      const scannedEventId = result[0]?.rawValue; // Assuming the scanned result is the eventId
      setselectedEvent(scannedEventId);

      // Check if the scanned eventId exists in the eventData
      const matchedEvent = eventData?.find(
        (event) => event.eventId === scannedEventId
      );

      if (matchedEvent) {
        setIsValidQr(true); // Valid QR code
        setIsQrScanned(true);
      } else {
        setIsValidQr(false); // Invalid QR code
      }
    }
  };

  const showScanner = () => {
    setIsValidQr(null);
    setIsQrScanned(false);
  };

  return (
    <div className="App">
      <Dialog>
        <DialogTrigger asChild>
          <Button>QR Scanner</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription className="sr-only">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          {isValidQr === null && (
            <Scanner
              scanDelay={3000}
              allowMultiple={true}
              onScan={handleGetQrResult}
            />
          )}
          {isValidQr === false && (
            <div className="flex flex-col items-center justify-center">
              <p>QR Code not found</p>
              <Button onClick={showScanner}>Scan Again</Button>
            </div>
          )}
          {isQrScanned && (
            <>
              <Label>Please choose who you would like to attend with.</Label>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col space-y-2"
                >
                  <Label className="text-primary-text">Parent/Guardian</Label>
                  {!isLoading ? (
                    parentData?.map((parent) => (
                      <FormField
                        key={parent.id}
                        control={form.control}
                        name="parents"
                        render={({ field }) => (
                          <FormItem className="space-x-2 space-y-0">
                            <div className="flex items-center gap-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={
                                    Array.isArray(field.value) &&
                                    field.value.some(
                                      (item) => item.id === parent.id
                                    ) // Check if the array contains the object with the same id
                                  }
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [
                                          ...(field.value || []),
                                          {
                                            id: parent.id,
                                          },
                                        ]
                                      : (field.value || []).filter(
                                          (item) => item.id !== parent.id
                                        ); // Remove the object if unchecked

                                    // Update the field value
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <Label>{`${parent.first_name} ${parent.last_name}`}</Label>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                  {error && <p>Error fetching guardian</p>}
                  {form.formState.errors.children && (
                    <FormMessage>
                      {form.formState.errors.children.message}
                    </FormMessage>
                  )}
                  <Label className="text-primary-text">Children</Label>

                  {!isLoading ? (
                    childData?.map((child) => (
                      <FormField
                        key={child.id}
                        control={form.control}
                        name="children"
                        render={({ field }) => (
                          <>
                            <FormItem className="space-x-2 space-y-0">
                              <div className="flex items-center gap-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={
                                      Array.isArray(field.value) &&
                                      field.value.some(
                                        (item) => item.id === child.id
                                      ) // Check if the array contains the object with the same id
                                    }
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [
                                            ...(field.value || []),
                                            {
                                              id: child.id,
                                            },
                                          ]
                                        : (field.value || []).filter(
                                            (item) => item.id !== child.id
                                          ); // Remove the object if unchecked

                                      // Update the field value
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <Label>{`${child.first_name} ${child.last_name}`}</Label>
                              </div>
                            </FormItem>
                          </>
                        )}
                      />
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                  {error && <p>Error fetching guardian</p>}
                  <div className="text-end">
                    <Button type="submit">Attend</Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

QrScannerEvents.propTypes = {
  eventData: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.string.isRequired,
      eventName: PropTypes.string.isRequired,
      eventDescription: PropTypes.string,
      eventDate: PropTypes.string.isRequired,
      eventTime: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default QrScannerEvents;
