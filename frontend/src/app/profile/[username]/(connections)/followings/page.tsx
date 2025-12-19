import UserFollowCard from "@/components/connections/UserFollowCard";

const DUMMY_FOLLOWINGS = [
  { id:"1", name:"Sam", username:"sama", bio:"...", isFollowing:true },
  { id:"2", name:"Tanyarlfes", username:"tanyarlfes", bio:"...", isFollowing:true },
  { id:"3", name:"Random Warfare Worldwide", username:"RWWReborn", bio:"...", isFollowing:false },
];


export default function FollowingsPage() {
  return (
    <div>
      {DUMMY_FOLLOWINGS.map((user) => (
        <UserFollowCard
          key={user.id}
          onPage="followings"
          {...user}
        />
      ))}
    </div>
  );
}
