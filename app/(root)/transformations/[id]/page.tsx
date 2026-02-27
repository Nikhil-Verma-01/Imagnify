import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { getImageById } from "@/lib/actions/image.actions";
import type { IImage } from "@/lib/database/models/image.model";
import { notFound } from "next/navigation";

const TransformationDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (!id) notFound();

  let image: IImage;

  try {
    image = await getImageById(id);
  } catch {
    notFound();
  }

  return (
    <>
      <Header
        title={image.title}
        subtitle={`Transformation: ${image.transformationType}`}
      />

      <section className="mt-10">
        <TransformedImage
          image={image}
          type={image.transformationType}
          title={image.title}
          isTransforming={false}
          transformationConfig={image.config as Transformations}
          hasDownload
        />
      </section>
    </>
  );
};

export default TransformationDetailsPage;
