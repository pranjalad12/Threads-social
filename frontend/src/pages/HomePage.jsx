import React, { useEffect, useState } from 'react';
import useShowText from "../hooks/useShowToast";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Post from "../Components/Post"; // Corrected import path
// Import SuggestedUsers if needed

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowText();

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/posts/get/feed');
                const data = await res.json();
                if (data.err) {
                    showToast('Errors', data.err, 'error');
                    return;
                } else {
                    console.log(data);
                    setPosts(data);
                }
            } catch (err) {
                showToast("Errori", err.message, "error");
            } finally {
                setLoading(false);
            }
        }
        getFeedPosts();
        console.log(posts);
    }, [showToast, setPosts]);

    return (
        <div>
            <Flex gap='10' alignItems={"flex-start"}>
                <Box flex={70}>
                    {!loading && posts.length === 0 && <h1>No posts to show</h1>}
                    {loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}
                
				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
                </Box>
                <Box flex={30}>
                    {/* Display SuggestedUsers component here if needed */}
                </Box>
            </Flex>
        </div>
    );
}

export default HomePage;
