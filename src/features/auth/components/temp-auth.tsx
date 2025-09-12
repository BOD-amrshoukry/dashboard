import Button from '../../../shared/components/button';

const TempAuth = ({ head, icon, description, href, hrefText }) => {
  return (
    <div className="flex flex-col gap-[16px] items-center">
      <p className="text-[40px] font-black">{head}</p>
      {icon}
      <p>{description}</p>
      <Button link={true} href={href} className={'w-full mt-[32px]'}>
        {hrefText}
      </Button>
    </div>
  );
};

export default TempAuth;

