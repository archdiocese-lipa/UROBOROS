import {
  dislikeComment,
  getCommentStatus,
  getDislikeCount,
  getLikeCount,
  likeComment,
} from "@/services/commentsService";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

const useLikeDislike = (comment_id, user_id,columnName) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addLikeMutation = useMutation({
    mutationFn: likeComment,
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["likeCount", comment_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["dislikeCount", comment_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentStatus", comment_id, user_id],
      });
    },
  });

  const addDislikeMutation = useMutation({
    mutationFn: dislikeComment,
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dislikeCount", comment_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["likeCount", comment_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentStatus", comment_id, user_id],
      });
    },
  });

  const { data } = useQuery({
    queryKey: ["commentStatus", comment_id, user_id],
    queryFn: () => getCommentStatus({ comment_id, user_id,columnName }),
    enabled: !!user_id && !!comment_id,
  });

  const { data: likeCount } = useQuery({
    queryKey: ["likeCount", comment_id],
    queryFn: () => getLikeCount({ comment_id,columnName }),
    enabled: !!comment_id,
  });

  const { data: dislikeCount } = useQuery({
    queryKey: ["dislikeCount", comment_id],
    queryFn: () => getDislikeCount({ comment_id,columnName }),
    enabled: !!comment_id,
  });

  return { addLikeMutation, addDislikeMutation, data, dislikeCount, likeCount };
};
export default useLikeDislike;
