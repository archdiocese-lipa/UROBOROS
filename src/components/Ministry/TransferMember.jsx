import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Icon } from "@iconify/react";

const TransferMember = ({ userId, groupId, firstName, lastName }) => {
  console.log(userId, groupId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="hover:text-primary-text">
          <div className="flex items-center gap-x-2">
            <Icon icon="mingcute:transfer-3-line" width={24} />
            <p className="hidden md:block">Transfer</p>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-x-2">
            <div>
              <Avatar>
                {/* <AvatarImage src={member.avatar_url} /> */}
                <AvatarFallback className="bg-primary-outline/60 text-primary-text">
                  {firstName?.charAt(0)}
                  {lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <AlertDialogTitle>
                Transfer {`${firstName} ${lastName}`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Move this user to a different ministry group.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogBody>Test</AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Transfer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

TransferMember.propTypes = {
  userId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
};

export default TransferMember;
