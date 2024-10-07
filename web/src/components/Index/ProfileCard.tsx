import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMeta,
  Icon,
  Image,
} from "semantic-ui-react";

function ProfileCard() {
  return (
    <Card>
      <Image src="/images/avatar/large/daniel.jpg" wrapped ui={false} />
      <CardContent>
        <CardHeader>Yingchen Liu</CardHeader>
        <CardMeta>Senior Software Engineer</CardMeta>
        <CardDescription>
          Yingchen is a Senior Software Engineer living in Melbourne, Australia.
        </CardDescription>
      </CardContent>
      <CardContent extra>
        <a>
          <Icon name="certificate" />
          {new Date().getFullYear() - 2016} years working experience
        </a>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
