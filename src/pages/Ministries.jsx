import CreateMinistry from "@/components/Ministry/CreateMinistry";
import MinistryCard from "@/components/Ministry/MinistryCard";
import { Description, Title } from "@/components/Title";

// Ministry dummy data

const ministryData = [
  {
    title: "Ministry A",
    description:
      "The Ministry A group is dedicated to fostering a strong sense of community and spiritual growth among its members. Our mission is to provide support, guidance, and meaningful opportunities for service and engagement within the church and the broader community. By organizing events, outreach programs, and regular gatherings, we aim to build lasting relationships, inspire positive change, and nurture the faith of everyone involved. We welcome individuals from all walks of life to join us in making a difference together.",
    createdDate: "14-Oct-2024, 12.50pm",
    members: [
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
    ],
  },

  {
    title: "Ministry B",
    description: "This is the group description of Ministry A.",
    createdDate: "14-Oct-2024, 12.50pm",
    members: [
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
    ],
  },
  {
    title: "Ministry C",
    description: "This is the group description of Ministry A.",
    createdDate: "14-Oct-2024, 12.50pm",
    members: [
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
    ],
  },
  {
    title: "Ministry D",
    description:
      "The Ministry A group is dedicated to fostering a strong sense of community and spiritual growth among its members. Our mission is to provide support, guidance, and meaningful opportunities for service and engagement within the church and the broader community. By organizing events, outreach programs, and regular gatherings, we aim to build lasting relationships, inspire positive change, and nurture the faith of everyone involved. We welcome individuals from all walks of life to join us in making a difference together.",
    createdDate: "14-Oct-2024, 12.50pm",
    members: [
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
    ],
  },
  {
    title: "Ministry E",
    description:
      "The Ministry A group is dedicated to fostering a strong sense of community and spiritual growth among its members. Our mission is to provide support, guidance, and meaningful opportunities for service and engagement within the church and the broader community. By organizing events, outreach programs, and regular gatherings, we aim to build lasting relationships, inspire positive change, and nurture the faith of everyone involved. We welcome individuals from all walks of life to join us in making a difference together.",
    createdDate: "14-Oct-2024, 12.50pm",
    members: [
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
    ],
  },
  {
    title: "Ministry F",
    description:
      "The Ministry A group is dedicated to fostering a strong sense of community and spiritual growth among its members. Our mission is to provide support, guidance, and meaningful opportunities for service and engagement within the church and the broader community. By organizing events, outreach programs, and regular gatherings, we aim to build lasting relationships, inspire positive change, and nurture the faith of everyone involved. We welcome individuals from all walks of life to join us in making a difference together.",
    createdDate: "14-Oct-2024, 12.50pm",
    members: [
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
      { src: "https://github.com/shadcn.png", alt: "@shadcn" },
    ],
  },
];

const Ministries = () => {
  return (
    <div className="relative flex flex-col gap-y-5">
      <div className="fixed bottom-20 right-7 z-10 md:bottom-10">
        <CreateMinistry />
      </div>

      <div>
        <Title>Ministry Management</Title>
        <Description>Manage your ministry.</Description>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {ministryData.map((ministry) => (
          <MinistryCard
            key={ministry.title}
            title={ministry.title}
            description={ministry.description}
            createdDate={ministry.createdDate}
            members={ministry.members}
          />
        ))}
      </div>
    </div>
  );
};

export default Ministries;
