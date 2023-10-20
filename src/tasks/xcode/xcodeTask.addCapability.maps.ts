import { Constants } from '../../constants';
import { XcodeAddMapsCapabilityRouting } from '../../types/mod.types';
import { applyObjectModification } from '../../utils/applyObjectModification';
import { readPListContent, writePListContent } from '../plistTask';

export function addMapsCapability(args: {
  targetName: string;
  routing: XcodeAddMapsCapabilityRouting[];
}): void {
  let plistContent = readPListContent(
    args.targetName,
    Constants.PLIST_FILE_NAME,
    true
  );

  const capabilityValues = {
    CFBundleDocumentTypes: [
      {
        CFBundleTypeName: 'MKDirectionsRequest',
        LSItemContentTypes: ['com.apple.maps.directionsrequest'],
      },
    ],
    MKDirectionsApplicationSupportedModes: args.routing.map(
      x => mapsCapabilityRouting[x]
    ),
  };
  plistContent = applyObjectModification(plistContent, {
    set: capabilityValues,
    strategy: 'merge_distinct',
  });

  writePListContent(plistContent, args.targetName);
}

const mapsCapabilityRouting: Record<XcodeAddMapsCapabilityRouting, string> = {
  bike: 'MKDirectionsModeBike',
  bus: 'MKDirectionsModeBus',
  car: 'MKDirectionsModeCar',
  ferry: 'MKDirectionsModeFerry',
  other: 'MKDirectionsModeOther',
  pedestrian: 'MKDirectionsModePedestrian',
  plane: 'MKDirectionsModePlane',
  'ride-share': 'MKDirectionsModeRideShare',
  'street-car': 'MKDirectionsModeStreetCar',
  subway: 'MKDirectionsModeSubway',
  taxi: 'MKDirectionsModeTaxi',
  train: 'MKDirectionsModeTrain',
};
